import { verifyAdminToken } from '../utils/admin.jwt.utils.js';
import { AppError } from '../utils/asyncHandler.js';

export const authenticateAdmin = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Admin authentication required. Please log in.', 401));
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAdminToken(token);
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Admin session expired. Please log in again.'
      : 'Invalid admin token. Please log in again.';
    return next(new AppError(msg, 401));
  }

  if (decoded.role !== 'admin') {
    return next(new AppError('Not authorized as admin.', 403));
  }

  req.admin = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  next();
};
