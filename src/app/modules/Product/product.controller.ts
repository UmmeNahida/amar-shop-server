import httpStatus from "http-status-codes";
import { catchAsync } from "@/app/utils/catchAsync";
import { sendResponse } from "@/app/utils/sendResponse";
import * as productService from "./product.service";

export const addProduct = catchAsync(async (req, res) => {
  const file = req.files;
  const result = await productService.createProduct(req.body, file);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "product has been added successfully",
    data: result,
  });
});

export const getSingleProduct = catchAsync(async (req, res) => {
  const productId = req.query.id as string;
  const result = await productService.getSingleProduct(productId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "product retrieved successfully",
    data: result,
  });
});

export const getAllProduct = catchAsync(async (req, res) => {
  const result = await productService.getAllProduct(
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "product has been retrieve successfully",
    data: result.data,
    meta: result.meta,
  });
});
