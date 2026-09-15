import httpStatus from "http-status-codes";
import { Product } from "./product.model";
import { IProduct, ProductStatus } from "./product.interface";
import { Category } from "../Category/category.model";
import { Brand } from "../Brand/brand.model";
import { CategoryStatus } from "../Category/category.interface";
import AppError from "@/app/ErrorHandler/appErrors";
import { BrandStatus } from "../Brand/brand.interface";
import { uploadedFiles } from "@/app/helper/datauri";


export const createProduct = async (payload: IProduct, files:any) => {
  const imgFiles = await uploadedFiles(files)

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
    images: imgFiles,
    status: payload.status,
  });

  return product;
};


const deleteProduct = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Product not found."
    );
  }

  if (product.status === ProductStatus.INACTIVE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product is already inactive."
    );
  }

  const deletedProduct =
    await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          status: ProductStatus.INACTIVE,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

  return deletedProduct;
};
export const updateProduct = async (
  productId: string,
  payload: Partial<IProduct>
) => {
  // 1. Check product exists
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Product not found."
    );
  }

  // 2. Check category if category is being updated
  if (payload.category) {
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
  }

  // 3. Check brand if brand is being updated
  if (payload.brand) {
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
  }

  // 4. Check duplicate SKU
  if (payload.sku) {
    const existingSku = await Product.findOne({
      sku: payload.sku,
      _id: { $ne: productId },
    });

    if (existingSku) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Product with SKU "${payload.sku}" already exists.`
      );
    }
  }

  // 5. Check duplicate slug
  if (payload.slug) {
    const existingSlug = await Product.findOne({
      slug: payload.slug,
      _id: { $ne: productId },
    });

    if (existingSlug) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Product with slug "${payload.slug}" already exists.`
      );
    }
  }

  // 6. Validate price and discount price
  const finalPrice =
    payload.price !== undefined
      ? payload.price
      : product.price;

  const finalDiscountPrice =
    payload.discountPrice !== undefined
      ? payload.discountPrice
      : product.discountPrice;

  if (
    finalDiscountPrice !== undefined &&
    finalDiscountPrice >= finalPrice
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Discount price must be less than regular price."
    );
  }

  // 7. Validate stock
  if (
    payload.stock !== undefined &&
    payload.stock < 0
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Stock cannot be negative."
    );
  }

  // 8. Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: payload,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category", "name slug")
    .populate("brand", "name slug");

  return updatedProduct;
};

export const getAllProduct = async()=>{
  const products = await Product.find();
  return products
}


