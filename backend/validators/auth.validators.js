import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/asyncHandler.js';

// ─── Run validator chain and short-circuit on errors ─────────────────────────
export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array({ onlyFirstError: true })[0].msg;
    return next(new AppError(message, 400));
  }
  next();
};

// ─── Reusable field rules ─────────────────────────────────────────────────────
const nameRule = body('name')
  .trim()
  .isLength({ min: 2, max: 80 })
  .withMessage('Name must be between 2 and 80 characters.');

const emailRule = body('email')
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage('Please enter a valid email address.');

const passwordRule = body('password')
  .isLength({ min: 6, max: 128 })
  .withMessage('Password must be at least 6 characters.');

const phoneRule = body('phone')
  .trim()
  .matches(/^\+?[1-9]\d{7,14}$/)
  .withMessage('Please enter a valid phone number with country code (e.g. +919284518038).');

// ─── Route-specific validator chains ─────────────────────────────────────────
export const registerValidator   = [nameRule, emailRule, passwordRule, validate];
export const loginValidator      = [emailRule, passwordRule, validate];
export const forgotValidator     = [emailRule, validate];
export const resetValidator      = [passwordRule, validate];
export const googleValidator     = [body('idToken').notEmpty().withMessage('Google ID token is required.'), validate];
export const sendOTPValidator    = [
  body().custom(({ phone, email }) => {
    if (email) return true;
    if (phone) return true;
    throw new Error('Email or phone is required.');
  }),
  body('email').optional().trim().toLowerCase().isEmail().withMessage('Please enter a valid email address.'),
  body('phone').optional().trim().matches(/^\+?[1-9]\d{7,14}$/).withMessage('Please enter a valid phone number with country code (e.g. +919284518038).'),
  validate,
];
export const verifyOTPValidator  = [
  body().custom(({ phone, email }) => {
    if (email) return true;
    if (phone) return true;
    throw new Error('Email or phone is required.');
  }),
  body('email').optional().trim().toLowerCase().isEmail().withMessage('Please enter a valid email address.'),
  body('phone').optional().trim().matches(/^\+?[1-9]\d{7,14}$/).withMessage('Please enter a valid phone number with country code (e.g. +919284518038).'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number.'),
  validate,
];
export const setPasswordValidator = [passwordRule, validate];
export const resetPasswordWithOtpValidator = [
  emailRule,
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be at least 6 characters.'),
  validate,
];
