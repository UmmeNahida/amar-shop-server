import { Router } from "express";
import * as orderController from "./order.controller";
import { checkAuth } from "@/app/utils/checkAuth";
import { validateRequest } from "@/app/middlewares/validateRequest";
import { OrderValidation } from "./order.validation";
import { Role } from "../User/user.interface";

const router = Router();

// ─── Customer routes ──────────────────────────────────────────────────────────

router.post(
  "/",
  checkAuth(Role.CUSTOMER),
  validateRequest(OrderValidation.createOrderSchema),
  orderController.createOrder,
);

router.get(
  "/my-orders",
  checkAuth(Role.CUSTOMER),
  orderController.getMyOrders,
);

router.patch(
  "/:id/cancel",
  checkAuth(Role.CUSTOMER),
  orderController.cancelOrder,
);

// ─── Shared (customer sees own, admin sees any) ───────────────────────────────

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.CUSTOMER),
  orderController.getOrderById,
);

// ─── Admin routes ─────────────────────────────────────────────────────────────

router.get("/", checkAuth(Role.ADMIN), orderController.getAllOrders);

router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN),
  validateRequest(OrderValidation.updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

router.patch(
  "/:id/payment",
  checkAuth(Role.ADMIN),
  validateRequest(OrderValidation.updatePaymentSchema),
  orderController.updatePaymentInfo,
);

export const orderRouter = router;
