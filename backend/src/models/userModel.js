const db = require("../config/db");

// Trouver un user par email
async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

// Trouver un user par id
async function findUserById(id) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

// Créer un user
async function createUser({ name, email, passwordHash, role = "USER" }) {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );

  return {
    id: result.insertId,
    name,
    email,
    role
  };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
