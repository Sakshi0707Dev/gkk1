import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

// ─── Token generators ─────────────────────────────────────────────────────────
export const signAccessToken = (payload) =>
  jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: ENV.JWT_ACCESS_EXPIRES });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: ENV.JWT_REFRESH_EXPIRES });

// ─── Token verifiers ──────────────────────────────────────────────────────────
export const verifyAccessToken = (token) =>
  jwt.verify(token, ENV.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, ENV.JWT_REFRESH_SECRET);

// ─── Cookie helper ────────────────────────────────────────────────────────────
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SEVEN_DAYS_MS,
    path: '/api/auth/refresh-token',   // restrict cookie to refresh endpoint
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
};

// ─── Issue token pair ─────────────────────────────────────────────────────────
export const issueTokenPair = (user) => {
  const payload = { id: user._id, role: user.role };
  return {
    accessToken:  signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};
