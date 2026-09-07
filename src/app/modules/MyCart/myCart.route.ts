

import { Router } from "express";
import * as myCartController from "./myCart.controller"
import { checkAuth } from "@/app/utils/checkAuth";
import { Role } from "../User/user.interface";


const router = Router()

router.post("/addToCart",checkAuth(Role.ADMIN,Role.CUSTOMER), myCartController.addToCart)

export const myCartRouter = router;
