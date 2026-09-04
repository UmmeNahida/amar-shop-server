import { Schema, model } from "mongoose";
import {
  BrandStatus,
  IBrand,
} from "./brand.interface";

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

    logo: {
      public_id: {
        type: String,
      },

      url: {
        type: String,
      },
    },

    status: {
      type: String,
      enum: Object.values(BrandStatus),
      default: BrandStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const Brand = model<IBrand>(
  "Brand",
  brandSchema
);