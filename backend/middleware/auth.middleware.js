import { verifyAccessToken } from '../utils/jwt.utils.js';
import { AppError, asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';

/**
 * Protects routes: validates Bearer access token and attaches req.user.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AUTH DEBUG] Authorization header:', authHeader || '(missing)');
  }

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
  console.log('[AUTH] *** protect middleware:');
  console.log('[AUTH] ***   JWT payload role:', decoded.role);
  console.log('[AUTH] ***   DB user role:', user.role);
  console.log('[AUTH] ***   DB user email:', user.email);
  console.log('[AUTH] ***   Match:', decoded.role === user.role ? 'YES' : 'MISMATCH!');
  next();
});

/**
 * Restrict access to specific roles.
 * Usage: restrictTo('admin')
 */
export const restrictTo = (...roles) => (req, _res, next) => {
  console.log('[AUTH] restrictTo: required roles:', roles, '| user role:', req.user?.role, '| user email:', req.user?.email);
  if (!roles.includes(req.user.role)) {
    console.log('[AUTH] restrictTo: ACCESS DENIED for', req.user?.email, 'with role', req.user?.role);
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  console.log('[AUTH] restrictTo: ACCESS GRANTED for', req.user?.email);
  next();
};
