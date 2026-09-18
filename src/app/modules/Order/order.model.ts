import { Schema, model } from "mongoose";
import {
  IOrder,
  IOrderItem,
  IOrderAddress,
  IPaymentInfo,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "./order.interface";
import { AddressType } from "../User/user.interface";

// ─── Order item sub-schema ────────────────────────────────────────────────────

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    sku: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

// ─── Address snapshot sub-schema ──────────────────────────────────────────────

const orderAddressSchema = new Schema<IOrderAddress>(
  {
    type: {
      type: String,
      enum: Object.values(AddressType),
      default: AddressType.HOME,
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    landmark: { type: String },
  },
  { _id: false },
);

// ─── Payment info sub-schema ──────────────────────────────────────────────────

const paymentInfoSchema = new Schema<IPaymentInfo>(
  {
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    transactionId: { type: String, trim: true },
    paidAt: { type: Date },
  },
  { _id: false },
);

// ─── Main order schema ────────────────────────────────────────────────────────

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: "Order must contain at least one item",
      },
    },
    shippingAddress: {
      type: orderAddressSchema,
      required: true,
    },
    itemsTotal: { type: Number, required: true, min: 0 },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    payment: {
      type: paymentInfoSchema,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    note: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", orderSchema);
