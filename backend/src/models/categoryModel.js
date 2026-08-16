import { pool } from "../db/pool.js";

export async function getAllCategories() {
  const { rows } = await pool.query("SELECT id, label FROM categories ORDER BY label");
  return rows;
}

export async function createCategory({ id, label }) {
  const { rows } = await pool.query(
    "INSERT INTO categories (id, label) VALUES ($1, $2) RETURNING id, label",
    [id, label]
  );
  return rows[0];
}
