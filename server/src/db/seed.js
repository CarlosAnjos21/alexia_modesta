import { pool } from "./pool.js";

const CATEGORIES = [
  { id: "vestidos", label: "Vestidos" },
  { id: "saias", label: "Saias" },
  { id: "blusas", label: "Blusas" },
];

const PRODUTOS = [
  {
    categoria: "vestidos",
    nome: "Vestido Mídi Polly Larissa",
    preco: 219.9,
    descricao: "Tecido super fluido, caimento leve e fechamento em zíper.",
    img: "",
    variantes: [
      { cor: "verde", tamanho: "38/42", estoque: 5 },
      { cor: "amarelo", tamanho: "38/42", estoque: 3 },
      { cor: "marrom", tamanho: "38/42", estoque: 4 },
    ],
  },
  {
    categoria: "vestidos",
    nome: "Vestido Alfaiataria Premium",
    preco: 249.9,
    descricao: "Cumprimento mídi, tecido encorpado e caimento estruturado.",
    img: "",
    variantes: [
      { cor: "azul", tamanho: "38/42", estoque: 4 },
      { cor: "caramelo", tamanho: "38/42", estoque: 3 },
      { cor: "amarelo", tamanho: "38/42", estoque: 2 },
    ],
  },
  {
    categoria: "vestidos",
    nome: "Vestido Chemise Botões",
    preco: 199.9,
    descricao: "Modelagem chemise com botões frontais e cinto de amarrar.",
    img: "",
    variantes: [{ cor: "rosa", tamanho: "38/42", estoque: 6 }],
  },
  {
    categoria: "saias",
    nome: "Saia Alfaiataria Premium",
    preco: 139.9,
    descricao: "Corte reto em alfaiataria premium, cós alto.",
    img: "",
    variantes: [
      { cor: "preto", tamanho: "M", estoque: 4 },
      { cor: "preto", tamanho: "G", estoque: 3 },
    ],
  },
  {
    categoria: "saias",
    nome: "Saia de Cetim",
    preco: 129.9,
    descricao: "Caimento fluido em cetim, comprimento midi.",
    img: "",
    variantes: [
      { cor: "bege", tamanho: "M", estoque: 3 },
      { cor: "bege", tamanho: "G", estoque: 2 },
    ],
  },
  {
    categoria: "saias",
    nome: "Saia Mídi Evasê Alfaiataria Premium",
    preco: 159.9,
    descricao: "Modelagem evasê com pregas frontais e cós estruturado com botões dourados.",
    img: "",
    variantes: [
      { cor: "bege", tamanho: "M", estoque: 3 },
      { cor: "bege", tamanho: "G", estoque: 3 },
      { cor: "verde", tamanho: "M", estoque: 2 },
      { cor: "verde", tamanho: "G", estoque: 1 },
      { cor: "marrom", tamanho: "M", estoque: 2 },
      { cor: "marrom", tamanho: "G", estoque: 2 },
      { cor: "azul", tamanho: "M", estoque: 1 },
      { cor: "azul", tamanho: "G", estoque: 1 },
    ],
  },
  {
    categoria: "saias",
    nome: "Saia Alfaiataria Importada",
    preco: 169.9,
    descricao: "Tecido importado de alfaiataria com caimento estruturado.",
    img: "",
    variantes: [
      { cor: "bege", tamanho: "M", estoque: 2 },
      { cor: "bege", tamanho: "G", estoque: 2 },
    ],
  },
  {
    categoria: "blusas",
    nome: "Blusa Poliamida Forrada",
    preco: 89.9,
    descricao: "Frente toda forrada, tecido leve.",
    img: "",
    variantes: [{ cor: "azul", tamanho: "Único", estoque: 8 }],
  },
  {
    categoria: "blusas",
    nome: "Blusa Assimétrica",
    preco: 84.9,
    descricao: "Corte assimétrico com barra em detalhe rendado.",
    img: "",
    variantes: [{ cor: "preto", tamanho: "Único", estoque: 6 }],
  },
  {
    categoria: "blusas",
    nome: "Blusa de Crepe",
    preco: 94.9,
    descricao: "Tecido crepe leve com gola em recorte discreto.",
    img: "",
    variantes: [{ cor: "terracota", tamanho: "Único", estoque: 5 }],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const c of CATEGORIES) {
      await client.query(
        "INSERT INTO categories (id, label) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET label = $2",
        [c.id, c.label]
      );
    }

    for (const p of PRODUTOS) {
      const { rows } = await client.query(
        "INSERT INTO products (categoria, nome, preco, descricao, img) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [p.categoria, p.nome, p.preco, p.descricao, p.img]
      );
      const productId = rows[0].id;

      for (const v of p.variantes) {
        await client.query(
          "INSERT INTO product_variants (product_id, cor, tamanho, estoque) VALUES ($1, $2, $3, $4)",
          [productId, v.cor, v.tamanho, v.estoque]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Seed concluído.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro no seed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
