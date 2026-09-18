import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "@/app/ErrorHandler/appErrors";
import { Product } from "../Product/product.model";
import { User } from "../User/user.model";
import { Order } from "./order.model";
import {
  ICreateOrderPayload,
  IOrderItem,
  OrderStatus,
  PaymentStatus,
} from "./order.interface";
import { ProductStatus } from "../Product/product.interface";
import { QueryBuilder } from "@/app/utils/QueryBuilder";
import { Role } from "../User/user.interface";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Human-readable order ID:  ORD-YYYYMMDD-<4 random hex chars> */
const generateOrderId = (): string => {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `ORD-${date}-${rand}`;
};

/**
 * Flat shipping cost rule:
 *  - free if itemsTotal >= 1000
 *  - otherwise 60 BDT
 * Adjust this function as the business grows.
 */
const calcShippingCost = (itemsTotal: number): number =>
  itemsTotal >= 1000 ? 0 : 150;

// ─── Create order ─────────────────────────────────────────────────────────────

export const createOrder = async (
  userId: string,
  payload: ICreateOrderPayload,
) => {
  // 1. Verify user
  const user = await User.findById(userId).lean();
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // 2. Resolve every item against the DB — never trust frontend price/stock
  const orderItems: IOrderItem[] = [];

  for (const item of payload.items) {
    if (!Types.ObjectId.isValid(item.productId)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid product ID: ${item.productId}`,
      );
    }

    const product = await Product.findById(item.productId).lean();

    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Product not found: ${item.productId}`,
      );
    }

    if (product.status !== ProductStatus.ACTIVE) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Product "${product.name}" is not available`,
      );
    }

    if (item.quantity < 1) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Quantity for "${product.name}" must be at least 1`,
      );
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for "${product.name}". Available: ${product.stock}`,
      );
    }

    // Use discountPrice when available, otherwise regular price — from DB only
    const unitPrice =
      product.discountPrice !== undefined && product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    const subtotal = unitPrice * item.quantity;

    orderItems.push({
      productId: new Types.ObjectId(item.productId),
      name: product.name, 
      image: product.images[0]?.url ?? "", 
      sku: product.sku, // snapshot
      quantity: item.quantity,
      unitPrice, 
      subtotal, 
    });
  }

  // 3. Server-side financial calculations — nothing from frontend
  const itemsTotal = orderItems.reduce(
    (sum, i) => sum + i.subtotal,
    0,
  );
  const shippingCost = calcShippingCost(itemsTotal);
  const discount = 0; // coupon logic can be added here later
  const total = itemsTotal + shippingCost - discount;

  // 4. Create the order document
  const order = await Order.create({
    orderId: generateOrderId(),
    userId: new Types.ObjectId(userId),
    items: orderItems,
    shippingAddress: payload.shippingAddress,
    itemsTotal,
    shippingCost,
    discount,
    total,
    payment: {
      method: payload.paymentMethod,
      status: PaymentStatus.UNPAID,
    },
    status: OrderStatus.PENDING,
    note: payload.note,
  });

  // 5. Decrement stock for each product
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity, soldCount: item.quantity },
    });
  }

  return order;
};

// ─── Get my orders (customer) ─────────────────────────────────────────────────

export const getMyOrders = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const orderQuery = new QueryBuilder(Order.find({ userId }), query)
    .filter()
    .sort()
    .select()
    .paginate();

  const [data, meta] = await Promise.all([
    orderQuery.build(),
    orderQuery.getMeta(),
  ]);

  return { data, meta };
};

// ─── Get single order ─────────────────────────────────────────────────────────

export const getOrderById = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const order = await Order.findById(orderId).lean();

  if (!order)
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  // Customers can only see their own orders
  if (role === Role.CUSTOMER && order.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied");
  }

  return order;
};

// ─── Get all orders (admin) ───────────────────────────────────────────────────

export const getAllOrders = async (
  query: Record<string, unknown>,
) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate("userId", "fullName email phone"),
    query,
  )
    .filter()
    .sort()
    .select()
    .paginate();

  const [data, meta] = await Promise.all([
    orderQuery.build(),
    orderQuery.getMeta(),
  ]);

  return { data, meta };
};

// ─── Update order status (admin) ─────────────────────────────────────────────

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  const order = await Order.findById(orderId);
  if (!order)
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  // Guard against illogical transitions
  const terminalStatuses = [
    OrderStatus.DELIVERED,
    OrderStatus.REFUNDED,
  ];
  if (terminalStatuses.includes(order.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot update a ${order.status} order`,
    );
  }

  order.status = status;
  await order.save();
  return order;
};

// ─── Cancel order (customer) ──────────────────────────────────────────────────

export const cancelOrder = async (
  orderId: string,
  userId: string,
) => {
  const order = await Order.findById(orderId);
  if (!order)
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  if (order.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied");
  }

  const cancellableStatuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
  ];
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Order cannot be cancelled at status: ${order.status}`,
    );
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();
  return order;
};

// ─── Update payment info (gateway callback / admin) ───────────────────────────

export const updatePaymentInfo = async (
  orderId: string,
  payload: {
    transactionId: string;
    status: PaymentStatus;
    paidAt?: Date;
  },
) => {
  const order = await Order.findById(orderId);
  if (!order)
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  order.payment.transactionId = payload.transactionId;
  order.payment.status = payload.status;

  if (payload.status === PaymentStatus.PAID) {
    order.payment.paidAt = payload.paidAt ?? new Date();
    // Auto-confirm on successful payment
    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CONFIRMED;
    }
  }

  await order.save();
  return order;
};
