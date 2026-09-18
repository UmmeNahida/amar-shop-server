import { Request, Response } from "express";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import AppError from "@/app/ErrorHandler/appErrors";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "@/app/utils/QueryBuilder";
import { CATEGORY_SEARCH_FIELDS } from "@/app/utils/constand";

export const createCategory = async (payload: ICategory) => {
  const name = payload.name.trim().toLocaleLowerCase();

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists",
    );
  }

  const result = await Category.create({
    ...payload,
    name,
  });

  return result;
};

export const deleteCategory = async (deletedId: string) => {
  const isExistCategory = await Category.findById({
    _id: deletedId,
  });

  if (!isExistCategory) {
    throw new AppError(httpStatus.NOT_FOUND, `category not found`);
  }

  const category = await Category.findByIdAndDelete(deletedId);

  return category;
};

export const getAllCategory = async (
  query: Record<string, unknown>,
) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(CATEGORY_SEARCH_FIELDS)
    .filter()
    .sort()
    .select()
    .paginate();

  const [data, meta] = await Promise.all([
    categoryQuery.build(),
    categoryQuery.getMeta(),
  ]);

  return { data, meta };
};
