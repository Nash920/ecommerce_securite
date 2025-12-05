const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Non autorisé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, name, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session invalide ou expirée." });
  }
}

module.exports = authMiddleware;
