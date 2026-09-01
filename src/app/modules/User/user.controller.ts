import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/app/utils/catchAsync";
import {sendResponse} from "@/app/utils/sendResponse";
import * as UserService from "./user.service";
import httpStatus from "http-status-codes";

export const registerUser = catchAsync(async (req:Request, res:Response) => {
 
  const result = await UserService.registerUser(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully.",
    data: result,
  });
});

export const allUsers = catchAsync(async(req,res)=>{
  const result = await UserService.allUsers()
  
   sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User login successfully.",
    data: result,
  });
})


export const myProfile = catchAsync(async(req,res)=>{
  const result = await UserService.getMyProfile(req.user._id)
  
   sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Profile get successfully.",
    data: result,
  });
})


export const updateProfile = catchAsync(async(req,res)=>{
  const updateInfo = req.body;
  const result = await UserService.updateMyProfile(req.user._id, updateInfo)
  
   sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My profile has been updated.",
    data: result,
  });
})


export const addAddress = catchAsync(async(req,res)=>{
  const userId = req.user._id;

  const result = await UserService.addAddress(userId,req.body);
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Address has been added successfully.",
    data: result,
  });

})


export const updateAddress = catchAsync(async(req,res)=>{
  const userId = req.user._id;
  const addressId = req.params.id as string;

  const result = await UserService.updateAddress(userId,addressId,req.body)
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Address has been updated successfully.",
    data: result,
  });

})

export const deleteAddress = catchAsync(async(req,res)=>{
  const userId = req.user._id;
  const addressId = req.params.id as string;

  const result = await UserService.deleteAddress(userId,addressId)
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Address has been deleted successfully.",
    data: result,
  });

})


export const setDefaultAddress = catchAsync(async(req,res)=>{
  const userId = req.user._id;
  const addressId = req.params.id as string;

  const result = await UserService.deleteAddress(userId,addressId)
    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Address has been set defualt",
    data: result,
  });

})




