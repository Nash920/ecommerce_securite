require('dotenv').config();
const bcrypt = require("bcrypt");
const db = require("../config/db");

async function createAdmin() {
  const name = process.env.ADMIN_NAME || "Manel";
  const email = process.env.ADMIN_EMAIL || "manel.benhamouda@efrei.net";
  const password = process.env.ADMIN_PASSWORD; // DOIT être défini dans .env
  const role = "ADMIN";

  if (!password) {
    console.error("❌ ADMIN_PASSWORD n'est pas défini dans le .env");
    process.exit(1);
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      console.log("❌ Admin existe déjà.");
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hash, role]
    );

    console.log("✅ Admin créé avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors de la création de l'admin:", err);
    process.exit(1);
  }
}

createAdmin();
