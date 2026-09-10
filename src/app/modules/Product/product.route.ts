import { Router } from "express";
import * as productController from "./product.controller";
import upload from "@/app/helper/multer.confic";
import { validateRequest } from "@/app/middlewares/validateRequest";
import { ProductValidation } from "./product.validation";

const router = Router();

router.post(
  "/add",
  upload.array("file"),
  validateRequest(ProductValidation.createProductValidationSchema),
  productController.addProduct,
);
router.get("/single", productController.addProduct);
router.get("/all", productController.getAllProduct);
// router.patch("/update", productController.addProduct)
// router.delete("/delete", productController.addProduct)

export const productRouter = router;
