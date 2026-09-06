

import { Router } from "express";
import * as myCartController from "./myCart.controller"


const router = Router()

router.post("addToCart", myCartController.addToCart)

export const productRouter = router;
