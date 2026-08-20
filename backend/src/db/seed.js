import { pool } from "./pool.js";

const CATEGORIES = [
  { id: "vestidos", label: "Vestidos" },
  { id: "saias", label: "Saias" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "camisas", label: "Camisas" },
  { id: "acessorios", label: "Acessórios" },
];

const PRODUTOS = [
  {
    categoria: "vestidos",
    nome: "Vestido Mídi Polly Larissa",
    preco: 119.9,
    descricao:
      "Tecido super fluido em toque suave, caimento leve e fechamento delicado em zíper.",
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
    preco: 149.9,
    descricao:
      "Comprimento mídi elegante, tecido encorpado de altíssima qualidade e caimento estruturado.",
    img: "",
    variantes: [
      { cor: "azul", tamanho: "38/42", estoque: 4 },
      { cor: "caramelo", tamanho: "38/42", estoque: 3 },
      { cor: "amarelo", tamanho: "38/42", estoque: 2 },
    ],
  },
  {
    categoria: "saias",
    nome: "Saia Mídi Evasê Alfaiataria Premium",
    preco: 109.9,
    descricao:
      "Modelagem evasê clássica com pregas frontais refinadas e cós estruturado.",
    img: "",
    variantes: [
      { cor: "bege", tamanho: "M", estoque: 3 },
      { cor: "bege", tamanho: "G", estoque: 3 },
      { cor: "verde", tamanho: "M", estoque: 2 },
    ],
  },
  {
    categoria: "saias",
    nome: "Saia de Cetim Plissada",
    preco: 110.9,
    descricao:
      "Caimento impecável em cetim nobre, brilho discreto e sofisticação.",
    img: "",
    variantes: [
      { cor: "champanhe", tamanho: "M", estoque: 4 },
      { cor: "rosé", tamanho: "G", estoque: 2 },
    ],
  },
  {
    categoria: "conjuntos",
    nome: "Conjunto Alfaiataria Modesta Rosé Gold",
    preco: 189.9,
    descricao:
      "Blazer acinturado e saia midi estruturada em tecido premium com toque aveludado.",
    img: "",
    variantes: [
      { cor: "rosé", tamanho: "M", estoque: 3 },
      { cor: "nude", tamanho: "G", estoque: 2 },
    ],
  },
  {
    categoria: "camisas",
    nome: "Camisa Seda Pura Gola Laço",
    preco: 79.9,
    descricao:
      "Confeccionada em seda refinada com detalhe de gravata borboleta adaptável e botões perolados.",
    img: "",
    variantes: [
      { cor: "off-white", tamanho: "M", estoque: 5 },
      { cor: "bege", tamanho: "G", estoque: 4 },
    ],
  },
  {
    categoria: "acessorios",
    nome: "Cinto Couro Legítimo Fivela Rosé Gold",
    preco: 39.9,
    descricao:
      "Cinto em couro nobre ajustável com acabamento escovado em tom rosé bronze.",
    img: "",
    variantes: [
      { cor: "caramelo", tamanho: "Único", estoque: 10 },
      { cor: "preto", tamanho: "Único", estoque: 8 },
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const c of CATEGORIES) {
      await client.query(
        "INSERT INTO categories (id, label) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET label = $2",
        [c.id, c.label],
      );
    }

    for (const p of PRODUTOS) {
      const { rows } = await client.query(
        "INSERT INTO products (categoria, nome, preco, descricao, img) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [p.categoria, p.nome, p.preco, p.descricao, p.img],
      );
      const productId = rows[0].id;

      for (const v of p.variantes) {
        await client.query(
          "INSERT INTO product_variants (product_id, cor, tamanho, estoque) VALUES ($1, $2, $3, $4)",
          [productId, v.cor, v.tamanho, v.estoque],
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
