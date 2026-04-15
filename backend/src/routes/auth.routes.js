// Rutas de autenticación
import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validate, schemas } from '../middlewares/validation.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario (Alumno, Centro, Empresa)
 * @access  Public
 */
router.post(
  '/register',
  validate(schemas.register),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post(
  '/login',
  validate(schemas.login),
  authController.login
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refrescar JWT token
 * @access  Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/me', authMiddleware, authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout del usuario
 * @access  Private
 */
router.post('/logout', authMiddleware, authController.logout);

export default router;
