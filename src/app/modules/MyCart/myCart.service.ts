import AppError from "@/app/ErrorHandler/appErrors";
import { User } from "../User/user.model";
import httpStatus from "http-status-codes";
import { Product } from "../Product/product.model";
import { Cart } from "./myCart.model";

export const addToCart = async (payload: any, userId: any) => {
  const { productId, quantity } = payload;

  const existUser = await User.findById(userId);
  if (!existUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // check the stock
  if (product.stock < quantity) {
    throw new AppError(httpStatus.NOT_FOUND, `stock not available`);
  }

  let cart = await Cart.findOne({userId})

  if(cart){

    const existingItem = cart.items.find(item=>{
      item.productId?.toString === productId
    });

    if(existingItem){
       existingItem.quantity += quantity;
    }else{
      cart.items.push({productId, quantity, price: product.price})
    }
  }else{
     cart = new Cart({
      userId,
      items:[{productId, quantity, price: product.price}]
     })
  }

  await cart.save();
  return cart;
};
