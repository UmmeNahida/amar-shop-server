import mongoose, { Schema } from "mongoose";
import { ICart } from "./myCart.interface";

const cartItemSchema = new Schema<ICart["items"][0]>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    // Price snapshot from DB — never accepted from the frontend
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
