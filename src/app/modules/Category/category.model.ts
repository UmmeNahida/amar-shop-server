import { Schema, model } from "mongoose";
import {
  CategoryStatus,
  ICategory,
} from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      public_id: {
        type: String,
      },

      url: {
        type: String,
      },
    },

    status: {
      type: String,
      enum: Object.values(CategoryStatus),
      default: CategoryStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = model<ICategory>(
  "Category",
  categorySchema
);