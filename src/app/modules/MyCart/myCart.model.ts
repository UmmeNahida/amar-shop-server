import mongoose, { Schema } from "mongoose";


const myCartSchema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref:"User",
    unique: true,
    require:true
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        require: true
      },
      quantity: {
        type: Number,
        require:true,
        min: 1
      },
      price: {
        type: Number,
        require: true
      }
    }
  ]
})

export const Cart = mongoose.model("Cart", myCartSchema)