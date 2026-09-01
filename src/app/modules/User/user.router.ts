import express from "express";
import * as UserValidation from "./user.validation";
import * as UserController from "./user.controller";
import upload from "@/app/helper/multer.confic";
import { validateRequest } from "@/app/middlewares/validateRequest";
import { checkAuth } from "@/app/utils/checkAuth";
import { Role } from "./user.interface";


const router = express.Router();

router.post(
  "/register",
  upload.single("file"),
  validateRequest(UserValidation.createUserValidationSchema),UserController.registerUser);

router.get("/all", UserController.allUsers)
router.get("/my-profile",checkAuth(Role.ADMIN, Role.CUSTOMER), UserController.myProfile)
router.patch("/update-profile",checkAuth(Role.ADMIN, Role.CUSTOMER),UserController.updateProfile)
router.post("/add-address", checkAuth(Role.ADMIN, Role.CUSTOMER),UserController.addAddress)
router.patch("/update-address/:id", checkAuth(Role.ADMIN,Role.CUSTOMER),UserController.updateAddress)
router.delete("/delete-address/:id",checkAuth(Role.ADMIN,Role.CUSTOMER),UserController.deleteAddress)
router.put("/set-default-address/:id",checkAuth(Role.ADMIN,Role.CUSTOMER),UserController.setDefaultAddress)


export const UserRoutes = router;