import { z } from "zod";
import { ProductStatus } from "./product.interface";

const productImageSchema = z.object({
  public_id: z.string().min(1, "Image public_id is required"),
  url: z.string().url("Invalid image URL"),
});

const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  value: z.string().min(1, "Variant value is required"),

  price: z
    .number()
    .min(0, "Variant price cannot be negative")
    .optional(),

  stock: z
    .number()
    .int()
    .min(0, "Variant stock cannot be negative")
    .optional(),
});

const productSpecificationSchema = z.object({
  key: z.string().min(1, "Specification key is required"),

  value: z
    .string()
    .min(1, "Specification value is required"),
});

const shippingSchema = z.object({
  weight: z
    .number()
    .min(0, "Weight cannot be negative")
    .optional(),

  freeShipping: z.boolean().default(false),

  estimatedDelivery: z.string().optional(),
});

const seoSchema = z.object({
  title: z.string().optional(),

  description: z.string().optional(),

  keywords: z.array(z.string()).default([]),
});

const createProductValidationSchema = z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .max(200, "Product name cannot exceed 200 characters")
      .trim(),

    slug: z
      .string()
      .min(2, "Slug is required")
      .trim()
      .toLowerCase(),

    shortDescription: z
      .string()
      .max(500, "Short description cannot exceed 500 characters")
      .trim()
      .optional(),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .trim(),

    sku: z
      .string()
      .min(2, "SKU is required")
      .trim()
      .toUpperCase(),

    category: z
      .string()
      .min(1, "Category is required"),

    brand: z
      .string()
      .min(1, "Brand is required"),

    price: z
      .number()
      .positive("Price must be greater than 0"),

    discountPrice: z
      .number()
      .positive("Discount price must be greater than 0")
      .optional(),
      
    stock: z
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative"),

    lowStockThreshold: z
      .number()
      .int("Low stock threshold must be an integer")
      .min(0, "Low stock threshold cannot be negative")
      .default(5),

    variants: z
      .array(productVariantSchema)
      .default([]),

    specifications: z
      .array(productSpecificationSchema)
      .default([]),

    shipping: shippingSchema.optional(),

    isFeatured: z.boolean().default(false),

    isNewArrival: z.boolean().default(false),

    status: z
      .enum(ProductStatus)
      .default(ProductStatus.ACTIVE),

    seo: seoSchema.optional(),
  })
  .refine(
    (data) =>
      data.discountPrice === undefined ||
      data.discountPrice < data.price,
    {
      message:
        "Discount price must be less than regular price",
      path: ["discountPrice"],
    }
  );

export const ProductValidation = {
  createProductValidationSchema,
};