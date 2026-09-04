import { catchAsync } from "@/app/utils/catchAsync";
import * as ServiceCategory from "@/app/modules/Category/category.service"
import { sendResponse } from "@/app/utils/sendResponse";
import httpStatus from "http-status-codes";



export const AddCategory = catchAsync(async(req, res)=>{
   const result = await ServiceCategory.createCategory(req.body);
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "Category has been added successfully",
    data:result
   })
})

export const deleteCategory = catchAsync(async(req, res)=>{
   const result = await ServiceCategory.deleteCategory(req.body.deletedId);
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "Category has been deleted successfully",
    data:result
   })
})


export const AllCategories = catchAsync(async(req, res)=>{
   const result = await ServiceCategory.getAllCategory();
   sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message: "Category has been added successfully",
    data:result
   })
})