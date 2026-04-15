// Rutas de Comentarios
import express from 'express';
import commentController from '../controllers/comment.controller.js';
import { validate, schemas } from '../middlewares/validation.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

/**
 * @route   POST /api/posts/:postId/comments
 * @desc    Crear comentario en post
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  validate(schemas.createComment),
  commentController.createComment
);

/**
 * @route   GET /api/posts/:postId/comments
 * @desc    Obtener comentarios de un post
 * @access  Public
 * @query   page=1, limit=10
 */
router.get(
  '/',
  commentController.getPostComments
);

/**
 * @route   PUT /api/comments/:id
 * @desc    Actualizar comentario
 * @access  Private (Owner only)
 */
router.put(
  '/:id',
  authMiddleware,
  validate(schemas.createComment),
  commentController.updateComment
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Eliminar comentario
 * @access  Private (Owner only)
 */
router.delete(
  '/:id',
  authMiddleware,
  commentController.deleteComment
);

/**
 * @route   POST /api/comments/:id/like
 * @desc    Dar like a un comentario
 * @access  Private
 */
router.post(
  '/:id/like',
  authMiddleware,
  commentController.likeComment
);

/**
 * @route   DELETE /api/comments/:id/like
 * @desc    Quitar like a un comentario
 * @access  Private
 */
router.delete(
  '/:id/like',
  authMiddleware,
  commentController.unlikeComment
);

export default router;
