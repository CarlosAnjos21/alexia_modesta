import { Router } from "express";
import { listProducts, getProduct, addProduct } from "../controllers/productController.js";
import { upload } from "../middleware/upload.js";

export const productRoutes = Router();

productRoutes.get("/", listProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", upload.single("imagem"), addProduct);
