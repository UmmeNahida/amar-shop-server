import httpStatus from "http-status-codes";
import { catchAsync } from "@/app/utils/catchAsync";
import { sendResponse } from "@/app/utils/sendResponse";
import * as orderService from "./order.service";
import { OrderStatus, PaymentStatus } from "./order.interface";

// ─── Customer ─────────────────────────────────────────────────────────────────

export const createOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await orderService.createOrder(userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: result,
  });
});

export const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await orderService.getMyOrders(
    userId,
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const getOrderById = catchAsync(async (req, res) => {
  const orderId = req.params.id as string;
  const result = await orderService.getOrderById(
    orderId,
    req.user._id,
    req.user.role,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const orderId = req.params.id as string;
  const result = await orderService.cancelOrder(
    orderId,
    req.user._id,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order cancelled successfully",
    data: result,
  });
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrders(
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const orderId = req.params.id as string;
  const { status } = req.body;
  const result = await orderService.updateOrderStatus(
    orderId,
    status as OrderStatus,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

export const updatePaymentInfo = catchAsync(async (req, res) => {
  const orderId = req.params.id as string;
  const { transactionId, status, paidAt } = req.body;
  const result = await orderService.updatePaymentInfo(orderId, {
    transactionId,
    status: status as PaymentStatus,
    paidAt: paidAt ? new Date(paidAt) : undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment info updated successfully",
    data: result,
  });
});
