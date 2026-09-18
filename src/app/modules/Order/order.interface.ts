import { Types } from "mongoose";
import { IAddress } from "../User/user.interface";

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum OrderStatus {
  PENDING = "PENDING", // just placed, awaiting payment confirmation
  CONFIRMED = "CONFIRMED", // payment confirmed, preparing to ship
  PROCESSING = "PROCESSING", // being packed / dispatched
  SHIPPED = "SHIPPED", // handed to courier
  DELIVERED = "DELIVERED", // received by customer
  CANCELLED = "CANCELLED", // cancelled before shipment
  REFUNDED = "REFUNDED", // money returned
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  CARD = "CARD",
  MOBILE_BANKING = "MOBILE_BANKING", // bKash, Nagad, etc.
  ONLINE = "ONLINE", // SSLCommerz / Stripe etc.
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// ─── Sub-document interfaces ───────────────────────────────────────────────────

/** One line-item inside an order — everything snapshotted from DB at order time */
export interface IOrderItem {
  productId: Types.ObjectId;
  name: string; // snapshot
  image: string; // first image URL snapshot
  sku: string; // snapshot
  quantity: number;
  unitPrice: number; // actual price from DB (discountPrice if set, else price)
  subtotal: number; // unitPrice × quantity — calculated server-side
}

/** Shipping address snapshot — copied from user's address at order time */
export type IOrderAddress = Omit<IAddress, "_id" | "isDefault">;

/** Payment/transaction record */
export interface IPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string; // from payment gateway
  paidAt?: Date;
}

// ─── Main Order interface ──────────────────────────────────────────────────────

export interface IOrder {
  orderId: string; // human-readable  e.g. ORD-20260917-XXXX
  userId: Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: IOrderAddress;

  // ── Financials (all server-calculated) ──
  itemsTotal: number; // sum of all item subtotals
  shippingCost: number; // flat or rule-based
  discount: number; // coupon / promo — 0 if none
  total: number; // itemsTotal + shippingCost - discount

  payment: IPaymentInfo;
  status: OrderStatus;

  note?: string; // optional customer note

  createdAt?: Date;
  updatedAt?: Date;
}

// ─── What the frontend sends ───────────────────────────────────────────────────

/** Only these fields come from the client. Everything else is derived on the server. */
export interface ICreateOrderPayload {
  items: {
    productId: string;
    quantity: number;
    // price is intentionally excluded — always fetched from DB
  }[];
  shippingAddress: IOrderAddress;
  paymentMethod: PaymentMethod;
  note?: string;
}
