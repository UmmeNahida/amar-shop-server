

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});

import { Schema, model } from "mongoose";
import {
  IProduct,
  IProductImage,
  IProductSpecification,
  IProductVariant,
  ProductStatus,
} from "./product.interface";

const productImageSchema = new Schema<IProductImage>(
  {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productVariantSchema = new Schema<IProductVariant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const productSpecificationSchema =
  new Schema<IProductSpecification>(
    {
      key: {
        type: String,
        required: true,
        trim: true,
      },

      value: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    images: {
      type: [productImageSchema],
      required: true,
      validate: {
        validator: (value: IProductImage[]) => value.length > 0,
        message: "At least one product image is required",
      },
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    variants: {
      type: [productVariantSchema],
      default: [],
    },

    specifications: {
      type: [productSpecificationSchema],
      default: [],
    },

    shipping: {
      weight: {
        type: Number,
        min: 0,
      },

      freeShipping: {
        type: Boolean,
        default: false,
      },

      estimatedDelivery: {
        type: String,
        trim: true,
      },
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
    },

    seo: {
      title: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>(
  "Product",
  productSchema
);