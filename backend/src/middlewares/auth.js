// Middleware de autenticación JWT
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import logger from '../config/logger.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Token inválido',
      });
    }

    logger.error('Error en autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error en autenticación',
    });
  }
};

// Middleware para verificar rol
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para esta acción',
      });
    }

    next();
  };
};
