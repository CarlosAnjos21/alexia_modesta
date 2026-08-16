import { getAllProducts, getProductById, createProduct } from "../models/productModel.js";

export async function listProducts(req, res) {
  const { categoria, q } = req.query;
  const produtos = await getAllProducts({ categoria, q });
  res.json(produtos);
}

export async function getProduct(req, res) {
  const produto = await getProductById(Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
  res.json(produto);
}

export async function addProduct(req, res) {
  const { categoria, nome, preco, desc, variantes } = req.body;

  if (!categoria || !nome || !preco) {
    return res.status(400).json({ erro: "categoria, nome e preco são obrigatórios" });
  }

  const img = req.file ? `/uploads/${req.file.filename}` : "";
  const variantesParsed = variantes ? JSON.parse(variantes) : [];

  const produto = await createProduct({
    categoria,
    nome,
    preco: Number(preco),
    desc,
    img,
    variantes: variantesParsed,
  });

  res.status(201).json(produto);
}
