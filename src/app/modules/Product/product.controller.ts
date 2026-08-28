import httpStatus from "http-status-codes";
import { catchAsync } from "@/app/utils/catchAsync";
import { sendResponse } from "@/app/utils/sendResponse";
import * as productService from "./product.service"


export const addProduct = catchAsync(async(req, res)=>{
   const result = await productService.addProduct(req.body);
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "product has been added successfully",
    data:result
   })
})