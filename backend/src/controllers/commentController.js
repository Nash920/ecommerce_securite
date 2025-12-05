const { getProductById } = require("../models/productModel");
const { getCommentsByProductId, createComment } = require("../models/commentModel");

// Petit échappement pour réduire XSS (gardé simple)
function sanitizeText(text) {
  if (!text) return "";
  return text.toString().replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// GET /api/products/:id/comments
async function listComments(req, res) {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "ID produit invalide." });
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    const comments = await getCommentsByProductId(productId);

    const safeComments = comments.map(c => ({
      ...c,
      content: sanitizeText(c.content)
    }));

    res.json(safeComments);
  } catch (err) {
    console.error("Erreur listComments:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// POST /api/products/:id/comments
async function addComment(req, res) {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "ID produit invalide." });
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim().length < 3) {
      return res.status(400).json({ message: "Le commentaire doit contenir au moins 3 caractères." });
    }

    const userId = req.user.id;

    const comment = await createComment({
      productId,
      userId,
      content: content.trim()
    });

    res.status(201).json({
      ...comment,
      content: sanitizeText(comment.content)
    });
  } catch (err) {
    console.error("Erreur addComment:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  listComments,
  addComment
};
