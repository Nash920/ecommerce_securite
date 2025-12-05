const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

const {
  listProducts,
  getOneProduct,
  createProductController,
  updateProductController,
  deleteProductController
} = require("../controllers/productController");

// Routes publiques (catalogue)
router.get("/products", listProducts);
router.get("/products/:id", getOneProduct);

// Routes admin (gestion produits)
router.post("/admin/products", auth, adminOnly, createProductController);
router.put("/admin/products/:id", auth, adminOnly, updateProductController);
router.delete("/admin/products/:id", auth, adminOnly, deleteProductController);

module.exports = router;
