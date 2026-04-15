// Middleware de manejo de errores
import logger from '../config/logger.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Error interno del servidor';

  // Cast error for wrong mongodb id
  if (err.name === 'CastError') {
    const message = `Recurso no encontrado. Error: ${err}`;
    err = new AppError(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token es inválido, intenta de nuevo';
    err = new AppError(message, 400);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token ha expirado, intenta de nuevo';
    err = new AppError(message, 400);
  }

  logger.error(`[${err.statusCode}] ${err.message}`);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
