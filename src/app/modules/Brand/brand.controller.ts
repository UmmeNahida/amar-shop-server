import { catchAsync } from "@/app/utils/catchAsync";
import * as BrandService from "./brand.service";
import { sendResponse } from "@/app/utils/sendResponse";
import httpStatus from "http-status-codes";


export const AddBrand = catchAsync(async(req, res)=>{
   const result = await BrandService.createBrand(req.body)
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "Brand has been added successfully",
    data:result
   })
})

export const deleteBrand = catchAsync(async(req, res)=>{

  const deletedId = req.params.id as string;

   const result = await BrandService.deleteBrand(deletedId)
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "Brand has been deleted successfully",
    data:result
   })
})


export const getAllBrand = catchAsync(async(req, res)=>{

   const result = await BrandService.getAllBrand()
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "All brand is retrieve successfully",
    data:result
   })
})
