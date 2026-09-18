import { catchAsync } from "@/app/utils/catchAsync";
import * as myCartService from "./myCart.service";
import { sendResponse } from "@/app/utils/sendResponse";
import httpStatus from "http-status-codes";

export const addToCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await myCartService.addToCart(userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product added to cart successfully",
    data: result,
  });
});

export const getMyCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await myCartService.getMyCart(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart retrieved successfully",
    data: result,
  });
});

export const updateCartItem = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId as string;
  const { quantity } = req.body;
  const result = await myCartService.updateCartItem(
    userId,
    productId,
    quantity,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart item updated successfully",
    data: result,
  });
});

export const removeFromCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId as string;
  const result = await myCartService.removeFromCart(
    userId,
    productId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product removed from cart successfully",
    data: result,
  });
});

export const clearCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await myCartService.clearCart(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart cleared successfully",
    data: result,
  });
});
