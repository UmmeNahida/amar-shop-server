import { ObjectId } from "mongoose";
import { ProductStatus } from "./product.enum";


export interface IProduct {
  name: string;

  slug: string;

  shortDescription?: string;

  description: string;

  sku: string;

  category: ObjectId;

  subCategory?: ObjectId;

  brand?: ObjectId;

  price: number;

  discountPrice?: number;

  images: {
    public_id: string;
    url: string;
  }[];

  stock: number;

  lowStockThreshold: number;

  rating: {
    average: number;
    count: number;
  };

  variants?: {
    color?: string;
    size?: string;
    sku: string;
    price: number;
    stock: number;
  }[];

  specifications?: {
    key: string;
    value: string;
  }[];

  shipping: {
    weight?: number;
    freeShipping: boolean;
    estimatedDelivery?: string;
  };

  isFeatured: boolean;

  isNewArrival: boolean;

  views: number;

  soldCount: number;

  status: ProductStatus;

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  createdAt: Date;

  updatedAt: Date;
}