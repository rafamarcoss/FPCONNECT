// Rutas de Posts
import express from 'express';
import postController from '../controllers/post.controller.js';
import { validate, schemas } from '../middlewares/validation.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Crear nuevo post
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  validate(schemas.createPost),
  postController.createPost
);

/**
 * @route   GET /api/posts
 * @desc    Obtener feed del usuario
 * @access  Private
 * @query   page=1, limit=10
 */
router.get(
  '/',
  authMiddleware,
  postController.getFeed
);

/**
 * @route   GET /api/posts/search/:term
 * @desc    Buscar posts por contenido
 * @access  Public
 */
router.get(
  '/search/:term',
  postController.searchPosts
);

/**
 * @route   GET /api/posts/:id
 * @desc    Obtener post específico
 * @access  Public
 */
router.get(
  '/:id',
  postController.getPost
);

/**
 * @route   GET /api/posts/user/:userId
 * @desc    Obtener posts de un usuario
 * @access  Public
 */
router.get(
  '/user/:userId',
  postController.getUserPosts
);

/**
 * @route   PUT /api/posts/:id
 * @desc    Actualizar post
 * @access  Private (Owner only)
 */
router.put(
  '/:id',
  authMiddleware,
  validate(schemas.createPost),
  postController.updatePost
);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Eliminar post
 * @access  Private (Owner only)
 */
router.delete(
  '/:id',
  authMiddleware,
  postController.deletePost
);

/**
 * @route   POST /api/posts/:id/like
 * @desc    Dar like a un post
 * @access  Private
 */
router.post(
  '/:id/like',
  authMiddleware,
  postController.likePost
);

/**
 * @route   DELETE /api/posts/:id/like
 * @desc    Quitar like a un post
 * @access  Private
 */
router.delete(
  '/:id/like',
  authMiddleware,
  postController.unlikePost
);

export default router;
