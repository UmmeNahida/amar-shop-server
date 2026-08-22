import { Schema, model } from "mongoose";
import {
  AddressType,
  AuthProvider,
  Role,
  UserStatus,
} from "./user.interface.js";

const addressSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(AddressType),
      default: AddressType.HOME,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
      required: true,
    },

    landmark: {
      type: String,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.CUSTOMER,
    },

    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.CREDENTIALS,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    addresses: {
      type: [addressSchema],
      default: [],
    },

    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);