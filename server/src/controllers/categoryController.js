import { getAllCategories, createCategory } from "../models/categoryModel.js";

export async function listCategories(_req, res) {
  const categorias = await getAllCategories();
  res.json(categorias);
}

export async function addCategory(req, res) {
  const { id, label } = req.body;
  if (!id || !label) {
    return res.status(400).json({ erro: "id e label são obrigatórios" });
  }
  const categoria = await createCategory({ id, label });
  res.status(201).json(categoria);
}
