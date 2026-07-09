import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import productRoutes from './routes/product.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import adminRoutes from './routes/admin.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ENV } from './config/env.js';
import './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [ENV.CLIENT_URL];
    if (ENV.PRODUCTION_CLIENT_URL) allowedOrigins.push(ENV.PRODUCTION_CLIENT_URL);
    if (ENV.FRONTEND_URL) allowedOrigins.push(ENV.FRONTEND_URL);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(session({
  secret: ENV.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: ENV.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// ─── NoSQL Injection Sanitisation ────────────────────────────────────────────
app.use(mongoSanitize());

// ─── Global Rate Limit ────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

// ─── Static Files ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'API is healthy.' }));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ─── Centralised Error Handler ───────────────────────────────────────────────
app.use(errorHandler);

export default app;
