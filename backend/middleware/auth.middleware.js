import { verifyAccessToken } from '../utils/jwt.utils.js';
import { AppError, asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

/**
 * Protects routes: validates Bearer access token and attaches req.user.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Access token expired. Please refresh your session.'
      : 'Invalid access token. Please log in again.';
    throw new AppError(msg, 401);
  }

  const user = await User.findById(decoded.id).select('-refreshTokens');
  if (!user) throw new AppError('User belonging to this token no longer exists.', 401);

  req.user = user;
  next();
});

/**
 * Restrict access to specific roles.
 * Usage: restrictTo('admin')
 */
export const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};
