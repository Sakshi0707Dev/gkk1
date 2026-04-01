import crypto from 'crypto';

/** Generates a cryptographically-secure hex token and its SHA-256 hash */
export const generateResetToken = () => {
  const rawToken  = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
};

/** Hash an existing token (for DB lookup) */
export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

/** Generate a 6-digit numeric OTP */
export const generateOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000));
