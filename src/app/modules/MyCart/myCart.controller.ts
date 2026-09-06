import { catchAsync } from "@/app/utils/catchAsync";
import * as myCartService from "./myCart.service"
import { sendResponse } from "@/app/utils/sendResponse";
import httpStatus from "http-status-codes";

export const addToCart = catchAsync(async(req, res)=>{
   const payload = req.body;
   const userId = req.user._id;
   const result = await myCartService.addToCart(payload,userId);
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "product has been added successfully",
    data:result
   })
})
