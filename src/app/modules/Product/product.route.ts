import { Router } from "express";
import * as productController from "./product.controller"


const router = Router()

router.post("/add", productController.addProduct)
router.get("/single", productController.addProduct)
// router.get("/all", productController.addProduct)
// router.patch("/update", productController.addProduct)
// router.delete("/delete", productController.addProduct)
