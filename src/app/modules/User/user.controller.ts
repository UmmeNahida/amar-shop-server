import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {sendResponse} from "../../utils/sendResponse.js";
import * as UserService from "./user.service.js";
import httpStatus from "http-status";

export const registerUser = catchAsync(async (req, res) => {
  const result = await UserService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully.",
    data: result,
  });
});

