import { ENV } from '../config/env.js';

const handleCastError = (err) => ({
  statusCode: 400,
  message: `Invalid value for field: ${err.path}.`,
});

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue?.[field];
  return {
    statusCode: 409,
    message: `An account with ${field} "${value}" already exists.`,
  };
};

const handleValidationError = (err) => ({
  statusCode: 400,
  message: Object.values(err.errors).map((e) => e.message).join(' '),
});

const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Your session has expired. Please log in again.',
});

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let { statusCode = 500, message = 'Internal server error.' } = err;

  // Mongoose / JWT error normalisation
  if (err.name === 'CastError')           ({ statusCode, message } = handleCastError(err));
  if (err.code === 11000)                 ({ statusCode, message } = handleDuplicateKeyError(err));
  if (err.name === 'ValidationError')     ({ statusCode, message } = handleValidationError(err));
  if (err.name === 'JsonWebTokenError')   ({ statusCode, message } = handleJWTError());
  if (err.name === 'TokenExpiredError')   ({ statusCode, message } = handleJWTExpiredError());

  // Never leak internal stack traces in production
  if (ENV.NODE_ENV === 'development') {
    console.error('❌ ', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
