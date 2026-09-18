import { Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number; // snapshot from DB at time of add/update — never from frontend
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
}
