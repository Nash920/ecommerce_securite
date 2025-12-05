require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const productRoutes = require('./src/routes/productRoutes');
const commentRoutes = require('./src/routes/commentRoutes');

const app = express();

const isProd = process.env.NODE_ENV === 'production';

// Sécurité headers
app.use(helmet());

// Body JSON + cookies
app.use(express.json());
app.use(cookieParser());

// CORS pour Angular (en dev)
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Rate limiting sur /login (anti brute-force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // 10 essais max
  message: {
    message: "Trop de tentatives de connexion, réessayez plus tard."
  }
});
app.use('/api/auth/login', loginLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', productRoutes);
app.use('/api', commentRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API en ligne' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
});
