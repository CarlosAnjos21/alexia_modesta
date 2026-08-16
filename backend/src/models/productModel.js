import { pool } from "../db/pool.js";

function mapRow(row) {
  return {
    id: row.id,
    categoria: row.categoria,
    nome: row.nome,
    preco: Number(row.preco),
    desc: row.descricao,
    img: row.img,
    variantes: row.variantes ?? [],
  };
}

export async function getAllProducts({ categoria, q } = {}) {
  const conditions = [];
  const params = [];

  if (categoria) {
    params.push(categoria);
    conditions.push(`p.categoria = $${params.length}`);
  }
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    conditions.push(`(LOWER(p.nome) LIKE $${params.length} OR LOWER(p.descricao) LIKE $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `SELECT p.id, p.categoria, p.nome, p.preco, p.descricao, p.img,
            COALESCE(
              json_agg(
                json_build_object('cor', v.cor, 'tamanho', v.tamanho, 'estoque', v.estoque)
              ) FILTER (WHERE v.id IS NOT NULL), '[]'
            ) AS variantes
     FROM products p
     LEFT JOIN product_variants v ON v.product_id = p.id
     ${where}
     GROUP BY p.id
     ORDER BY p.id`,
    params
  );

  return rows.map(mapRow);
}

export async function getProductById(id) {
  const { rows } = await pool.query(
    `SELECT p.id, p.categoria, p.nome, p.preco, p.descricao, p.img,
            COALESCE(
              json_agg(
                json_build_object('cor', v.cor, 'tamanho', v.tamanho, 'estoque', v.estoque)
              ) FILTER (WHERE v.id IS NOT NULL), '[]'
            ) AS variantes
     FROM products p
     LEFT JOIN product_variants v ON v.product_id = p.id
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function createProduct({ categoria, nome, preco, desc, img, variantes }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO products (categoria, nome, preco, descricao, img) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [categoria, nome, preco, desc ?? "", img ?? ""]
    );
    const productId = rows[0].id;

    for (const v of variantes ?? []) {
      await client.query(
        "INSERT INTO product_variants (product_id, cor, tamanho, estoque) VALUES ($1, $2, $3, $4)",
        [productId, v.cor, v.tamanho, v.estoque ?? 0]
      );
    }

    await client.query("COMMIT");
    return getProductById(productId);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateVariantEstoque(productId, cor, tamanho, estoque) {
  await pool.query(
    "UPDATE product_variants SET estoque = $1 WHERE product_id = $2 AND cor = $3 AND tamanho = $4",
    [estoque, productId, cor, tamanho]
  );
}
