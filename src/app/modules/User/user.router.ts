import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import * as UserValidation from "./user.validation.js";
import * as UserController from "./user.controller.js";
import { success } from "zod";
import type { Error } from "mongoose";
import upload from "../../helper/multer.confic.js";
import parseBufferToURI from "../../helper/datauri.js";
import cloudinary from "../../helper/cloudinary.js";


const router = express.Router();

router.post(
  "/register",
  upload.array("file",5),
  validateRequest(UserValidation.createUserValidationSchema),UserController.registerUser);

export const UserRoutes = router;