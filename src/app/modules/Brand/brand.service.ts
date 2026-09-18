import AppError from "@/app/ErrorHandler/appErrors";
import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "@/app/utils/QueryBuilder";
import { BRAND_SEARCH_FIELDS } from "@/app/utils/constand";

export const createBrand = async (payload: IBrand) => {
  const name = payload.name.trim().toLocaleLowerCase();
  console.log("name", name);
  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    throw new AppError(httpStatus.CONFLICT, "Brand already exists");
  }

  const result = await Brand.create({
    ...payload,
    name,
  });

  return result;
};

export const deleteBrand = async (deletId: string) => {
  const isExistBrand = await Brand.findOne({ _id: deletId });

  if (!isExistBrand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand is Not found");
  }

  const result = await Brand.findByIdAndDelete(deletId);
  return result;
};

export const getAllBrand = async (query: Record<string, unknown>) => {
  const brandQuery = new QueryBuilder(Brand.find(), query)
    .search(BRAND_SEARCH_FIELDS)
    .filter()
    .sort()
    .select()
    .paginate();

  const [data, meta] = await Promise.all([
    brandQuery.build(),
    brandQuery.getMeta(),
  ]);

  return { data, meta };
};
