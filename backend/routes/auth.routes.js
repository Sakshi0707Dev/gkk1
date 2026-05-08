import { Router } from 'express';
import passport from 'passport';
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
  resetPasswordWithOtp,
  verifyOTP,
  setPassword,
  googleOAuthCallback,
} from '../controllers/auth.controller.js';

import { protect } from '../middleware/auth.middleware.js';

import {
  registerValidator,
  loginValidator,
  forgotValidator,
  resetValidator,
  googleValidator,
  verifyOTPValidator,
  resetPasswordWithOtpValidator,
  setPasswordValidator,
} from '../validators/auth.validators.js';

import { ENV } from '../config/env.js';

const router = Router();

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again in 15 minutes.',
  },
});

router.post('/register',      authLimit, registerValidator,   register);
router.post('/login',         authLimit, loginValidator,      login);

const getClientUrl = () => {
  return ENV.NODE_ENV === 'production' && ENV.PRODUCTION_CLIENT_URL
    ? ENV.PRODUCTION_CLIENT_URL
    : ENV.CLIENT_URL;
};

if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  router.post('/google',        authLimit, googleValidator,     googleAuth);
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: true, failureRedirect: `${getClientUrl()}/login-success?error=google_auth_failed` }),
    googleOAuthCallback
  );
  console.log('[ROUTES] Google OAuth routes enabled');
} else {
  router.post('/google', (_req, res) => {
    res.status(503).json({ success: false, message: 'Google OAuth not configured.' });
  });
  console.log('[ROUTES] Google OAuth routes disabled');
}

router.post('/refresh-token',           refreshToken);
router.post('/forgot-password',         forgotValidator,      forgotPassword);
router.post('/verify-otp',    authLimit, verifyOTPValidator,  verifyOTP);
router.post('/reset-password',          resetPasswordWithOtpValidator, resetPasswordWithOtp);
router.post('/reset-password/:token',   resetValidator,       resetPassword);

router.get ('/me',     protect, getMe);
router.post('/logout', protect, logout);
router.post('/set-password', protect, setPasswordValidator, setPassword);

export default router;