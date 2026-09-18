import { Router } from "express";
import * as myCartController from "./myCart.controller";
import { checkAuth } from "@/app/utils/checkAuth";
import { Role } from "../User/user.interface";

const router = Router();

// All cart routes require authentication — customers only
router.post(
  "/",
  checkAuth(Role.CUSTOMER),
  myCartController.addToCart,
);

router.get("/", checkAuth(Role.CUSTOMER), myCartController.getMyCart);

router.patch(
  "/:productId",
  checkAuth(Role.CUSTOMER),
  myCartController.updateCartItem,
);

router.delete(
  "/clear",
  checkAuth(Role.CUSTOMER),
  myCartController.clearCart,
);

router.delete(
  "/:productId",
  checkAuth(Role.CUSTOMER),
  myCartController.removeFromCart,
);

export const myCartRouter = router;
