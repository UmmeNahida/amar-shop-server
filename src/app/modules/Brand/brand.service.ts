import AppError from "@/app/ErrorHandler/appErrors";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import httpStatus from "http-status-codes";

export const createBrand = async (payload: IBrand) => {
  const name = payload.name.trim().toLocaleLowerCase();
  console.log("name",name)
  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Brand already exists"
    );
  }
  
  const result = await Brand.create({
    ...payload,
    name,
  });

  return result;
};

export const deleteBrand = async(deletId:string)=>{
  const isExistBrand = await Brand.findOne({_id: deletId})

  if(!isExistBrand){
      throw new AppError(httpStatus.NOT_FOUND,"Brand is Not found")
  }

  const result = await Brand.findByIdAndDelete(deletId);
  return result;
}


export const getAllBrand = async()=>{
  const result = await Brand.find();
  return result;
}

