require('dotenv').config();
const db = require("./db");

async function test() {
  try {
    console.log("DB_HOST =", process.env.DB_HOST);
    console.log("DB_PORT =", process.env.DB_PORT);
    console.log("DB_USER =", process.env.DB_USER);
    console.log("DB_PASSWORD =", process.env.DB_PASSWORD === "" ? "(vide)" : "(non vide)");
    console.log("DB_NAME =", process.env.DB_NAME);

    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("Connexion MySQL OK 🚀 Résultat :", rows[0].result);
  } catch (error) {
    console.error("❌ Erreur MySQL complète :", error);
  }
}

test();
