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

  // Errores de Prisma (Base de datos)
  if ((err.code && err.clientVersion) || (err.message && err.message.includes('prisma'))) { 
    let message = 'Ocurrió un error en la base de datos. Por favor, inténtalo más tarde.';
    let statusCode = 500;
    
    if (err.code === 'P2002') {
      message = 'Ya existe un registro con ese valor (duplicado).';
      statusCode = 400;
    } else if (err.code === 'P2025') {
      message = 'No se encontró el registro solicitado.';
      statusCode = 404;
    } else if (err.code === 'P2021' || (err.message && err.message.includes('does not exist in the current database'))) {
      message = 'Error de configuración: Faltan tablas en la base de datos. Pide al administrador que ejecute las migraciones.';
      statusCode = 500;
    }
    
    err = new AppError(message, statusCode);
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
