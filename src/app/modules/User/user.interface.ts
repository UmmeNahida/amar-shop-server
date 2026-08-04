export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum AuthProvider {
  CREDENTIALS = "CREDENTIALS",
  GOOGLE = "GOOGLE",
}

export enum AddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  OTHER = "OTHER",
}

import { Types } from "mongoose";

export interface IAddress {
  _id?: Types.ObjectId;
  type: AddressType;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  area: string;
  street: string;
  postalCode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface IUser {
  fullName: string;
  username?: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: Role;
  provider: AuthProvider;
  isVerified: boolean;
  status: UserStatus;
  addresses: IAddress[];
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
