import { OAuth2Client } from 'google-auth-library';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/asyncHandler.js';

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

/**
 * Verify a Google ID token and return the decoded payload.
 * Throws AppError on failure.
 */
export const verifyGoogleToken = async (idToken) => {
  if (!ENV.GOOGLE_CLIENT_ID) {
    throw new AppError('Google OAuth is not configured on this server.', 501);
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: ENV.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Empty payload');
    return payload;
  } catch {
    throw new AppError('Invalid or expired Google token.', 401);
  }
};
