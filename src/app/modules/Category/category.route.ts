import { Router } from "express";
import * as ControllerCategory from "./category.controller";
import { checkAuth } from "@/app/utils/checkAuth";
import { Role } from "../User/user.interface";



const router = Router();

router.post("/create", checkAuth(Role.ADMIN,Role.CUSTOMER), ControllerCategory.AddCategory)
router.delete("/delete", checkAuth(Role.ADMIN,Role.CUSTOMER), ControllerCategory.deleteCategory)
router.get("/all", ControllerCategory.AllCategories);

export const categoryRouter = router;