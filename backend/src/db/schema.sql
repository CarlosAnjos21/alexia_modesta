CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  categoria TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  nome TEXT NOT NULL,
  preco NUMERIC(10, 2) NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  img TEXT NOT NULL DEFAULT '',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cor TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
