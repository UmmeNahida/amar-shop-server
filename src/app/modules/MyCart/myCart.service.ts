import AppError from "@/app/ErrorHandler/appErrors";
import { User } from "../User/user.model";
import httpStatus from "http-status-codes";
import { Product } from "../Product/product.model";
import { Cart } from "./myCart.model";
import { Role } from "../User/user.interface";

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

    const existingItem = cart.items.find(item=>(
      item.productId?.toString() === productId
    ));
    
    // existingItem is get always undefine 
    if(existingItem){
      const newQuantity = existingItem.quantity + quantity;
      
      // check again the quantity
      if(product.stock < newQuantity){
         throw new AppError(httpStatus.NOT_FOUND, `stock not available`);
      }

      existingItem.quantity = newQuantity;
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


export const removeFromCart = async (
  userId: string,
  productId: string
) => {
  // 1. Check user
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }

  // 2. Check role
  if (user.role !== Role.CUSTOMER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only customer can manage cart"
    );
  }

  // 3. Find user's cart
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Cart not found"
    );
  }

  // 4. Check whether product exists in cart
  const existingItem = cart.items.find(
    (item) => item?.productId?.toString() === productId
  );

  if (!existingItem) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Product is not in your cart"
    );
  }

  // 5. Remove item
  await cart.items.pull({productId})

  // 6. Save
  await cart.save();

  return cart;
};
