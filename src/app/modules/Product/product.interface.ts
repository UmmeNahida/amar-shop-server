import { Types } from "mongoose";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IProductImage {
  public_id: string;
  url: string;
}

export interface IProductVariant {
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export interface IProduct {
  name: string;
  slug: string;

  shortDescription?: string;
  description: string;

  sku: string;

  category: Types.ObjectId;
  brand: Types.ObjectId;

  price: number;
  discountPrice?: number;

  images: IProductImage[];

  stock: number;
  lowStockThreshold: number;

  rating: {
    average: number;
    count: number;
  };

  variants?: IProductVariant[];

  specifications?: IProductSpecification[];

  shipping?: {
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
}