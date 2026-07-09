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

router.get('/google', (req, res, next) => {
  if (!ENV.GOOGLE_CLIENT_ID || !ENV.GOOGLE_CLIENT_SECRET) {
    console.log('[OAUTH] Google OAuth not configured - missing credentials');
    return res.status(503).json({ success: false, message: 'Google OAuth not configured.' });
  }
  console.log('[OAUTH] Initiating Google OAuth flow...');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    session: true,
    failureRedirect: `${getClientUrl()}/?google_error=auth_failed`,
    successRedirect: undefined,
  }),
  (req, res) => {
    console.log('[OAUTH] Callback reached');
    console.log('[OAUTH] Authenticated user:', req.user?.email || 'none');
    console.log('[OAUTH] Session ID:', req.sessionID);

    if (!req.user) {
      console.error('[OAUTH] ERROR: req.user is missing after authenticate!');
      return res.redirect(`${getClientUrl()}/?google_error=no_user`);
    }

    console.log('[OAUTH] Google OAuth success for:', req.user.email);
    googleOAuthCallback(req, res, (err) => {
      if (err) {
        console.error('[OAUTH] Callback handler error:', err.message);
        return res.redirect(`${getClientUrl()}/?google_error=${encodeURIComponent(err.message)}`);
      }
      console.log('[OAUTH] Redirect executed for:', req.user.email);
    });
  }
);

router.post('/refresh-token',           refreshToken);
router.post('/forgot-password',         forgotValidator,      forgotPassword);
router.post('/verify-otp',    authLimit, verifyOTPValidator,  verifyOTP);
router.post('/reset-password',          resetPasswordWithOtpValidator, resetPasswordWithOtp);
router.post('/reset-password/:token',   resetValidator,       resetPassword);

router.get ('/me',     protect, getMe);
router.post('/logout', protect, logout);
router.post('/set-password', protect, setPasswordValidator, setPassword);

console.log('[ROUTES] Registering auth routes');
console.log('[ROUTES] Google OAuth enabled:', Boolean(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET));

router.get('/debug-oauth-routes', (_req, res) => {
  const googleCallbackUrl = ENV.NODE_ENV === 'production' 
    ? (ENV.GOOGLE_CALLBACK_URL_PROD || ENV.GOOGLE_CALLBACK_URL_DEV)
    : ENV.GOOGLE_CALLBACK_URL_DEV;
  
  return res.json({
    googleEnabled: Boolean(ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET),
    callbackUrl: googleCallbackUrl,
    clientUrl: ENV.CLIENT_URL,
    prodClientUrl: ENV.PRODUCTION_CLIENT_URL,
    routes: [
      { method: 'POST', path: '/api/auth/google' },
      { method: 'GET', path: '/api/auth/google' },
      { method: 'GET', path: '/api/auth/google/callback' }
    ]
  });
});

export default router;