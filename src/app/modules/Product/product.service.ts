import httpStatus from "http-status-codes";
import { Product } from "./product.model";
import { IProduct } from "./product.interface";
import { Category } from "../Category/category.model";
import { Brand } from "../Brand/brand.model";
import { CategoryStatus } from "../Category/category.interface";
import AppError from "@/app/ErrorHandler/appErrors";
import { BrandStatus } from "../Brand/brand.interface";


export const createProduct = async (payload: IProduct) => {
  // 1. Check Category
  const category = await Category.findOne({
    _id: payload.category,
    status: CategoryStatus.ACTIVE,
  });

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found or inactive."
    );
  }

  // 2. Check Brand
  const brand = await Brand.findOne({
    _id: payload.brand,
    status: BrandStatus.ACTIVE,
  });

  if (!brand) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Brand not found or inactive."
    );
  }

  // 3. Check duplicate SKU
  const isSkuExists = await Product.findOne({
    sku: payload.sku,
  });

  if (isSkuExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Product with SKU "${payload.sku}" already exists.`
    );
  }

  // 4. Check duplicate slug
  const isSlugExists = await Product.findOne({
    slug: payload.slug,
  });

  if (isSlugExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Product with slug "${payload.slug}" already exists.`
    );
  }

  // 5. Validate discount price
  if (
    payload.discountPrice !== undefined &&
    payload.discountPrice >= payload.price
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Discount price must be less than regular price."
    );
  }

  // 6. Validate stock
  if (payload.stock < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Stock cannot be negative."
    );
  }

  // 7. Create product
  const product = await Product.create({
    ...payload,

    // These values should be controlled by backend
    rating: {
      average: 0,
      count: 0,
    },

    views: 0,

    soldCount: 0,

    status: payload.status,
  });

  return product;
};


