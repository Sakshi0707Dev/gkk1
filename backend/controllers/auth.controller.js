import User from '../models/user.model.js';
import { AppError, asyncHandler } from '../utils/asyncHandler.js';
import {
  issueTokenPair,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from '../utils/jwt.utils.js';
import { generateResetToken, hashToken, generateOTP } from '../utils/crypto.utils.js';
import {
  sendPasswordResetEmail,
  sendPasswordResetOTPEmail,
  sendWelcomeEmail,
} from '../services/email.service.js';
import { sendOTPviaSMS } from '../services/otp.service.js';
import { verifyGoogleToken } from '../services/google.service.js';
import { ENV } from '../config/env.js';

// ─── Helper: attach tokens and respond ───────────────────────────────────────
const sendTokenResponse = (res, user, statusCode = 200) => {
  const { accessToken, refreshToken } = issueTokenPair(user);

  // Persist refresh token in DB (for rotation + revocation)
  User.findByIdAndUpdate(
    user._id,
    { $push: { refreshTokens: refreshToken } },
    { new: true }
  ).exec();

  setRefreshCookie(res, refreshToken);

  res.status(statusCode).json({
    success: true,
    message: statusCode === 201 ? 'Account created successfully.' : 'Logged in successfully.',
    token: accessToken,
    data: {
      token: accessToken,
      accessToken,
      user: user.toPublic(),
    },
  });
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('An account with this email already exists.', 409);

  const user = await User.create({ name: name.trim(), email, password });

  // Fire-and-forget welcome email (non-blocking)
  sendWelcomeEmail({ to: user.email, name: user.name }).catch(() => {});

  sendTokenResponse(res, user, 201);
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password (it's excluded by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // Generic error prevents user enumeration
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  sendTokenResponse(res, user);
});

// ─── POST /api/auth/google ────────────────────────────────────────────────────
export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const payload = await verifyGoogleToken(idToken);

  const { sub: googleId, email, name, picture } = payload;

  // Find by googleId first, then email (handles existing email-signup users)
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Link Google account if it wasn't linked before
    if (!user.googleId) {
      user.googleId = googleId;
      user.isVerified = true;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }
  } else {
    // New Google user
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture || null,
      isVerified: true,    // Google accounts are pre-verified
    });
  }

  sendTokenResponse(res, user);
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'User retrieved successfully.',
    data: { user: req.user.toPublic() },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    // Remove this refresh token from the DB whitelist
    await User.findByIdAndUpdate(req.user._id, { $pull: { refreshTokens: token } });
  }

  clearRefreshCookie(res);

  res.json({ success: true, message: 'Logged out successfully.', data: null });
});

// ─── POST /api/auth/refresh-token ─────────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError('No refresh token provided.', 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
  }

  // Fetch user with their token list
  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user) throw new AppError('User no longer exists.', 401);

  // Verify token is in the whitelist (detects reuse after logout)
  if (!user.refreshTokens.includes(token)) {
    // Token reuse detected — invalidate ALL tokens (family breach)
    await User.findByIdAndUpdate(decoded.id, { $set: { refreshTokens: [] } });
    clearRefreshCookie(res);
    throw new AppError('Refresh token reuse detected. All sessions revoked. Please log in again.', 401);
  }

  // Rotate: remove old, issue new
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  const { accessToken, refreshToken: newRefreshToken } = issueTokenPair(user);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  setRefreshCookie(res, newRefreshToken);

  res.json({
    success: true,
    message: 'Token refreshed successfully.',
    data: { accessToken, user: user.toPublic() },
  });
});

// ─── POST /api/auth/forgot-password ───────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // Always respond identically — prevents email enumeration
  const genericResponse = () =>
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      data: null,
    });

  if (!user) return genericResponse();
  if (user.googleId && !user.password) {
    // Google-only accounts can't reset password via email
    return genericResponse();
  }

  const { rawToken, hashedToken } = generateResetToken();

  user.resetPasswordToken  = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save({ validateBeforeSave: false });

  const resetURL = `${ENV.CLIENT_URL}/reset-password/${rawToken}`;

  try {
    await sendPasswordResetEmail({ to: user.email, name: user.name, resetURL });
  } catch {
    // Clean up on email failure so user can try again
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Email could not be sent. Please try again later.', 500);
  }

  genericResponse();
});

// ─── POST /api/auth/reset-password ────────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) throw new AppError('Reset token is invalid or has expired.', 400);

  user.password            = password;
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  // Invalidate all active sessions after password change
  user.refreshTokens       = [];
  await user.save();

  clearRefreshCookie(res);

  res.json({
    success: true,
    message: 'Password reset successful. Please log in with your new password.',
    data: null,
  });
});

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
export const sendOTP = asyncHandler(async (req, res) => {
  const { phone, email } = req.body;

  if (email) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) throw new AppError('No account found with that email address.', 404);

    const otp = generateOTP();
    const otpHash = hashToken(otp);

    if (ENV.NODE_ENV !== 'production') {
      console.log('[AUTH DEBUG] Preparing password reset OTP for:', user.email);
    }

    user.passwordResetOtp = {
      code: otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    };
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetOTPEmail({ to: user.email, name: user.name, otp });

    return res.json({
      success: true,
      message: 'OTP sent to your email.',
      data: null,
    });
  }

  // Find user by phone or the authenticated user (if logged in)
  const userId = req.user?._id;
  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ phone });

  if (!user) throw new AppError('No account found with that phone number.', 404);

  const otp     = generateOTP();
  const otpHash = hashToken(otp); // store hash, never plaintext

  user.otp = {
    code:      otpHash,
    expiresAt: new Date(Date.now() + ENV.OTP_EXPIRES_MINUTES * 60 * 1000),
  };
  await user.save({ validateBeforeSave: false });

  await sendOTPviaSMS(phone, otp);

  res.json({
    success: true,
    message: `OTP sent to ${phone}. Valid for ${ENV.OTP_EXPIRES_MINUTES} minutes.`,
    data: null,
  });
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
export const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, email, otp } = req.body;

  if (email) {
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+passwordResetOtp.code +passwordResetOtp.expiresAt +passwordResetOtp.verified');
    if (!user) throw new AppError('No account found with that email address.', 404);

    if (!user.passwordResetOtp?.code || !user.passwordResetOtp?.expiresAt) {
      throw new AppError('No OTP was requested for this email.', 400);
    }

    if (new Date() > user.passwordResetOtp.expiresAt) {
      throw new AppError('OTP has expired. Please request a new one.', 400);
    }

    const hashedInput = hashToken(otp);
    if (hashedInput !== user.passwordResetOtp.code) {
      throw new AppError('Invalid OTP. Please try again.', 400);
    }

    user.passwordResetOtp.verified = true;
    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      data: null,
    });
  }

  const user = await User.findOne({ phone }).select('+otp.code +otp.expiresAt');
  if (!user) throw new AppError('No account found with that phone number.', 404);

  if (!user.otp?.code || !user.otp?.expiresAt) {
    throw new AppError('No OTP was requested for this account.', 400);
  }

  if (new Date() > user.otp.expiresAt) {
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  const hashedInput = hashToken(otp);
  if (hashedInput !== user.otp.code) {
    throw new AppError('Invalid OTP. Please try again.', 400);
  }

  // Mark phone as verified, clear OTP
  user.isVerified = true;
  user.otp        = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(res, user);
});

export const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+passwordResetOtp.code +passwordResetOtp.expiresAt +passwordResetOtp.verified +refreshTokens');

  if (!user) throw new AppError('No account found with that email address.', 404);
  if (!user.passwordResetOtp?.verified) {
    throw new AppError('OTP verification is required before resetting password.', 400);
  }
  if (!user.passwordResetOtp?.expiresAt || new Date() > user.passwordResetOtp.expiresAt) {
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  user.password = newPassword;
  user.passwordResetOtp = {
    code: undefined,
    expiresAt: undefined,
    verified: false,
  };
  user.refreshTokens = [];
  await user.save();

  clearRefreshCookie(res);

  res.json({
    success: true,
    message: 'Password set successfully. You can now login.',
    data: null,
  });
});

// ─── POST /api/auth/set-password ───────────────────────────────────────────────
export const setPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  req.user.password = password;
  await req.user.save();

  res.json({
    success: true,
    message: 'Password set successfully.',
    data: { user: req.user.toPublic() },
  });
});

// ─── GET /api/auth/google/callback ────────────────────────────────────────────
export const googleOAuthCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError('Google authentication failed.', 401);

  const { accessToken, refreshToken } = issueTokenPair(user);

  await User.findByIdAndUpdate(
    user._id,
    { $push: { refreshTokens: refreshToken } },
    { new: true }
  );

  setRefreshCookie(res, refreshToken);

  const redirectURL =
    `${ENV.CLIENT_URL}/login-success?token=${encodeURIComponent(accessToken)}`;
  return res.redirect(redirectURL);
});
