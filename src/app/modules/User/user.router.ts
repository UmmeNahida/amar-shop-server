import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import * as UserValidation from "./user.validation.js";
import * as UserController from "./user.controller.js";


const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidation.createUserValidationSchema),UserController.registerUser);

export const UserRoutes = router;