import httpStatus from "http-status-codes";
import { catchAsync } from "@/app/utils/catchAsync";
import { sendResponse } from "@/app/utils/sendResponse";
import * as productService from "./product.service"


export const addProduct = catchAsync(async(req, res)=>{
  console.log("req.body:", req.body)
   const file = req.files;
   const result = await productService.createProduct(req.body, file);
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "product has been added successfully",
    data:result
   })
})


export const getAllProduct = catchAsync(async(req, res)=>{
   const result = await productService.getAllProduct();
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "product has been retrieve successfully",
    data:result
   })
})



