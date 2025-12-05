const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// Profil utilisateur connecté
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Profil accessible",
    user: req.user
  });
});

// Dashboard admin
router.get("/admin/dashboard", auth, adminOnly, (req, res) => {
  res.json({
    message: "Bienvenue sur le dashboard admin",
    user: req.user
  });
});

module.exports = router;
