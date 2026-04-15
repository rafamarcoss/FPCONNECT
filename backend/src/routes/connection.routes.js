// Rutas de Conexiones (Follow System)
import express from 'express';
import connectionController from '../controllers/connection.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   GET /api/connections/followers
 * @desc    Obtener mis seguidores
 * @access  Private
 */
router.get(
  '/followers',
  authMiddleware,
  connectionController.getMyFollowers
);

/**
 * @route   GET /api/connections/following
 * @desc    Obtener usuarios que sigo
 * @access  Private
 */
router.get(
  '/following',
  authMiddleware,
  connectionController.getMyFollowing
);

/**
 * @route   POST /api/connections/:userId/follow
 * @desc    Seguir a un usuario
 * @access  Private
 */
router.post(
  '/:userId/follow',
  authMiddleware,
  connectionController.followUser
);

/**
 * @route   DELETE /api/connections/:userId/follow
 * @desc    Dejar de seguir a un usuario
 * @access  Private
 */
router.delete(
  '/:userId/follow',
  authMiddleware,
  connectionController.unfollowUser
);

/**
 * @route   GET /api/connections/:userId/status
 * @desc    Obtener estado de conexión con usuario
 * @access  Private
 */
router.get(
  '/:userId/status',
  authMiddleware,
  connectionController.getConnectionStatus
);

/**
 * @route   POST /api/connections/:userId/block
 * @desc    Bloquear usuario
 * @access  Private
 */
router.post(
  '/:userId/block',
  authMiddleware,
  connectionController.blockUser
);

/**
 * @route   DELETE /api/connections/:userId/block
 * @desc    Desbloquear usuario
 * @access  Private
 */
router.delete(
  '/:userId/block',
  authMiddleware,
  connectionController.unblockUser
);

/**
 * @route   GET /api/connections/recommendations
 * @desc    Obtener recomendaciones de usuarios a seguir
 * @access  Private
 */
router.get(
  '/recommendations',
  authMiddleware,
  connectionController.getRecommendations
);

export default router;
