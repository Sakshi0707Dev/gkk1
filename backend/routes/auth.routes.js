import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import {
  register,
  login,
  googleAuth,
  getMe,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
} from '../controllers/auth.controller.js';

import { protect } from '../middleware/auth.middleware.js';

import {
  registerValidator,
  loginValidator,
  forgotValidator,
  resetValidator,
  googleValidator,
  sendOTPValidator,
  verifyOTPValidator,
} from '../validators/auth.validators.js';

const router = Router();

// ─── Strict rate limit for sensitive auth endpoints ───────────────────────────
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again in 15 minutes.',
  },
});

const otpLimit = rateLimit({
  windowMs: 10 * 60 * 1000,    // 10 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait before requesting another.',
  },
});

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register',      authLimit, registerValidator,   register);
router.post('/login',         authLimit, loginValidator,      login);
router.post('/google',        authLimit, googleValidator,     googleAuth);
router.post('/refresh-token',           refreshToken);
router.post('/forgot-password',         forgotValidator,      forgotPassword);
router.post('/reset-password/:token',   resetValidator,       resetPassword);
router.post('/send-otp',      otpLimit,  sendOTPValidator,    sendOTP);
router.post('/verify-otp',    authLimit, verifyOTPValidator,  verifyOTP);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get ('/me',     protect, getMe);
router.post('/logout', protect, logout);

export default router;
