import express from "express";
import cors from "cors";
import path from "node:path";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/categorias", categoryRoutes);
app.use("/api/produtos", productRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
});
