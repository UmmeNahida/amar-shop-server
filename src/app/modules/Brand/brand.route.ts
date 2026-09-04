import { checkAuth } from "@/app/utils/checkAuth";
import { Router } from "express";
import { Role } from "../User/user.interface";
import * as BrandController from "./brand.controller"


const router = Router();

router.post("/create", checkAuth(Role.ADMIN,Role.CUSTOMER), BrandController.AddBrand)
router.delete("/delete/:id", checkAuth(Role.ADMIN,Role.CUSTOMER), BrandController.deleteBrand)
router.get("/all", BrandController.getAllBrand);



export const brandRouter = router;