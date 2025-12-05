const db = require("../config/db");

// Récupérer les commentaires d'un produit
async function getCommentsByProductId(productId) {
  const [rows] = await db.query(
    `SELECT c.id, c.content, c.created_at, u.name AS author
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.product_id = ?
     ORDER BY c.created_at DESC`,
    [productId]
  );
  return rows;
}

// Créer un commentaire
async function createComment({ productId, userId, content }) {
  const [result] = await db.query(
    "INSERT INTO comments (product_id, user_id, content) VALUES (?, ?, ?)",
    [productId, userId, content]
  );

  return {
    id: result.insertId,
    product_id: productId,
    user_id: userId,
    content
  };
}

module.exports = {
  getCommentsByProductId,
  createComment
};
