const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../models/productModel");

function validateProduct({ name, description, price, stock }) {
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 3) {
    errors.push("Le nom du produit doit contenir au moins 3 caractères.");
  }

  if (description && description.length > 2000) {
    errors.push("La description est trop longue (2000 caractères max).");
  }

  const priceNum = Number(price);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    errors.push("Le prix doit être un nombre positif.");
  }

  const stockNum = Number(stock);
  if (!Number.isInteger(stockNum) || stockNum < 0) {
    errors.push("Le stock doit être un entier positif.");
  }

  return {
    valid: errors.length === 0,
    errors,
    priceNum,
    stockNum
  };
}

// GET /api/products
async function listProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("Erreur listProducts:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// GET /api/products/:id
async function getOneProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    res.json(product);
  } catch (err) {
    console.error("Erreur getOneProduct:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// POST /api/admin/products
async function createProductController(req, res) {
  try {
    const { name, description = "", price, stock } = req.body;

    const { valid, errors, priceNum, stockNum } = validateProduct({
      name,
      description,
      price,
      stock
    });

    if (!valid) {
      return res.status(400).json({ message: "Données invalides.", errors });
    }

    const product = await createProduct({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      stock: stockNum
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Erreur createProduct:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// PUT /api/admin/products/:id
async function updateProductController(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const { name, description = "", price, stock } = req.body;

    const { valid, errors, priceNum, stockNum } = validateProduct({
      name,
      description,
      price,
      stock
    });

    if (!valid) {
      return res.status(400).json({ message: "Données invalides.", errors });
    }

    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    const updated = await updateProduct(id, {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      stock: stockNum
    });

    res.json(updated);
  } catch (err) {
    console.error("Erreur updateProduct:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

// DELETE /api/admin/products/:id
async function deleteProductController(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    await deleteProduct(id);
    res.json({ message: "Produit supprimé." });
  } catch (err) {
    console.error("Erreur deleteProduct:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  listProducts,
  getOneProduct,
  createProductController,
  updateProductController,
  deleteProductController
};
