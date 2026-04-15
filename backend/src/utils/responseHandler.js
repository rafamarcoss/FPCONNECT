// Utilidades de manejo de errores y respuestas
import logger from '../config/logger.js';

// Respuesta exitosa estandarizada
export const successResponse = (res, data, message = 'Éxito', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Respuesta de error estandarizada
export const errorResponse = (res, message = 'Error interno del servidor', statusCode = 500, errors = null) => {
  logger.error(`[${statusCode}] ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  });
};

// Formatear error de validación
export const formatValidationError = (details) => {
  return details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
  }));
};

// Envuelve función async para capturar errores
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
