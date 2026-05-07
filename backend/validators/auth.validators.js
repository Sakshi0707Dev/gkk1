import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/asyncHandler.js';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array({ onlyFirstError: true })[0].msg;
    return next(new AppError(message, 400));
  }
  next();
};

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

export const registerValidator   = [nameRule, emailRule, passwordRule, validate];
export const loginValidator      = [emailRule, passwordRule, validate];
export const forgotValidator     = [emailRule, validate];
export const resetValidator      = [passwordRule, validate];
export const googleValidator     = [body('idToken').notEmpty().withMessage('Google ID token is required.'), validate];
export const setPasswordValidator = [passwordRule, validate];
export const verifyOTPValidator = [
  emailRule,
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number.'),
  validate,
];
export const resetPasswordWithOtpValidator = [
  emailRule,
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be at least 6 characters.'),
  validate,
];