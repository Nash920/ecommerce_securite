const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");

const isProd = process.env.NODE_ENV === "production";

// Validation du mot de passe : 12 caractères + 3 types sur 4
function validatePassword(password) {
  const errors = [];

  if (!password || password.length < 12) {
    errors.push("Le mot de passe doit contenir au moins 12 caractères.");
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const typesCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

  if (typesCount < 3) {
    errors.push("Le mot de passe doit contenir au moins 3 types de caractères : minuscules, majuscules, chiffres, spéciaux.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validation basique email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nom, email et mot de passe sont obligatoires." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email invalide." });
    }

    const { valid, errors } = validatePassword(password);
    if (!valid) {
      return res.status(400).json({
        message: "Mot de passe trop faible.",
        errors
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      passwordHash,
      role: "USER"
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error("Erreur register:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont obligatoires." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,                     // true en prod (HTTPS), false en local
      sameSite: isProd ? "strict" : "lax",
      maxAge: 30 * 60 * 1000
    });

    return res.json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Erreur login:", err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}

// POST /api/auth/logout
async function logout(req, res) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax"
  });

  return res.json({ message: "Déconnexion réussie." });
}

module.exports = {
  register,
  login,
  logout
};
