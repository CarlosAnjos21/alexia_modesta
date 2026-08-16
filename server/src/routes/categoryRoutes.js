import { Router } from "express";
import { listCategories, addCategory } from "../controllers/categoryController.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", listCategories);
categoryRoutes.post("/", addCategory);
