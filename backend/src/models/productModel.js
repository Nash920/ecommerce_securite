const db = require("../config/db");

// Récupérer tous les produits
async function getAllProducts() {
  const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
}

// Récupérer un produit par id
async function getProductById(id) {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0] || null;
}

// Créer un produit
async function createProduct({ name, description, price, stock }) {
  const [result] = await db.query(
    "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    [name, description, price, stock]
  );
  return { id: result.insertId, name, description, price, stock };
}

// Mettre à jour un produit
async function updateProduct(id, { name, description, price, stock }) {
  await db.query(
    "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
    [name, description, price, stock, id]
  );
  return getProductById(id);
}

// Supprimer un produit
async function deleteProduct(id) {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
