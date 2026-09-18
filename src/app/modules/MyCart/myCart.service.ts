import AppError from "@/app/ErrorHandler/appErrors";
import { User } from "../User/user.model";
import { Product } from "../Product/product.model";
import { Cart } from "./myCart.model";
import { ProductStatus } from "../Product/product.interface";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";

// ─── Shared guard helpers ─────────────────────────────────────────────────────

const assertUserExists = async (userId: string) => {
  const user = await User.findById(userId).lean();
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const assertProductAvailable = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid product ID");
  }

  const product = await Product.findById(productId).lean();
  if (!product)
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");

  if (product.status !== ProductStatus.ACTIVE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product is not available",
    );
  }

  return product;
};

const assertStock = (available: number, requested: number) => {
  if (requested < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Quantity must be at least 1",
    );
  }
  if (available < requested) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Only ${available} unit(s) available in stock`,
    );
  }
};

// ─── Add to cart ──────────────────────────────────────────────────────────────

export const addToCart = async (
  userId: string,
  payload: { productId: string; quantity: number },
) => {
  const { productId, quantity } = payload;

  await assertUserExists(userId);
  const product = await assertProductAvailable(productId);
  assertStock(product.stock, quantity);

  let cart = await Cart.findOne({ userId });

  if (cart) {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      // Verify combined quantity against current stock
      assertStock(product.stock, newQuantity);
      existingItem.quantity = newQuantity;
      // Re-sync price from DB in case it changed
      existingItem.price = product.price;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
        price: product.price, // always from DB
      });
    }
  } else {
    cart = new Cart({
      userId,
      items: [
        {
          productId: new Types.ObjectId(productId),
          quantity,
          price: product.price,
        },
      ],
    });
  }

  await cart.save();
  return cart.populate(
    "items.productId",
    "name images price status stock",
  );
};

// ─── Get my cart ──────────────────────────────────────────────────────────────

export const getMyCart = async (userId: string) => {
  await assertUserExists(userId);

  const cart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "name images price status stock slug",
  );

  if (!cart) {
    return { userId, items: [], totalItems: 0, totalPrice: 0 };
  }

  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { cart, totalItems, totalPrice };
};

// ─── Update cart item quantity ─────────────────────────────────────────────────

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid product ID");
  }

  if (quantity < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Quantity must be at least 1",
    );
  }

  await assertUserExists(userId);
  const product = await assertProductAvailable(productId);
  assertStock(product.stock, quantity);

  const cart = await Cart.findOne({ userId });
  if (!cart)
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found");

  const item = cart.items.find(
    (i) => i.productId.toString() === productId,
  );

  if (!item) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Product not found in cart",
    );
  }

  item.quantity = quantity;
  item.price = product.price; // re-sync price from DB

  await cart.save();
  return cart.populate(
    "items.productId",
    "name images price status stock",
  );
};

// ─── Remove product from cart ─────────────────────────────────────────────────

export const removeFromCart = async (
  userId: string,
  productId: string,
) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid product ID");
  }

  await assertUserExists(userId);

  const cart = await Cart.findOne({ userId });
  if (!cart)
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found");

  const itemExists = cart.items.some(
    (item) => item.productId.toString() === productId,
  );

  if (!itemExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Product not found in cart",
    );
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  ) as typeof cart.items;

  await cart.save();
  return cart.populate(
    "items.productId",
    "name images price status stock",
  );
};

// ─── Clear cart ───────────────────────────────────────────────────────────────

export const clearCart = async (userId: string) => {
  await assertUserExists(userId);

  const cart = await Cart.findOne({ userId });
  if (!cart)
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found");

  if (cart.items.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cart is already empty",
    );
  }

  cart.items = [] as typeof cart.items;
  await cart.save();

  return cart;
};
