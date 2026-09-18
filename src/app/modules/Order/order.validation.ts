import { z } from "zod";
import { AddressType } from "../User/user.interface";
import { PaymentMethod } from "./order.interface";

// ─── Shipping address ─────────────────────────────────────────────────────────

const orderAddressSchema = z.object({
  type: z.nativeEnum(AddressType).default(AddressType.HOME),

  fullName: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),

  phone: z
    .string({ error: "Phone is required" })
    .trim()
    .regex(
      /^(?:\+8801|01)[3-9]\d{8}$/,
      "Please enter a valid Bangladeshi phone number",
    ),

  country: z.string({ error: "Country is required" }).trim().min(2),
  state: z.string({ error: "State is required" }).trim().min(2),
  city: z.string({ error: "City is required" }).trim().min(2),
  area: z.string({ error: "Area is required" }).trim().min(2),
  street: z
    .string({ error: "Street is required" })
    .trim()
    .min(5)
    .max(200),
  postalCode: z
    .string({ error: "Postal code is required" })
    .trim()
    .min(3)
    .max(10),
  landmark: z.string().trim().max(100).optional(),
});

// ─── Single order item ────────────────────────────────────────────────────────

const orderItemSchema = z.object({
  productId: z
    .string({ error: "Product ID is required" })
    .min(1, "Product ID is required"),

  quantity: z
    .number({ error: "Quantity is required" })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
  // price is intentionally excluded — always fetched from DB
});

// ─── Create order ─────────────────────────────────────────────────────────────

const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),

  shippingAddress: orderAddressSchema,

  paymentMethod: z.nativeEnum(PaymentMethod, {
    error: "Invalid payment method",
  }),

  note: z.string().trim().max(500).optional(),
});

// ─── Update order status (admin) ──────────────────────────────────────────────

const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

// ─── Update payment info (after gateway callback) ────────────────────────────

const updatePaymentSchema = z.object({
  transactionId: z
    .string()
    .trim()
    .min(1, "Transaction ID is required"),
  status: z.string().min(1, "Payment status is required"),
  paidAt: z.string().datetime().optional(),
});

export const OrderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentSchema,
};
