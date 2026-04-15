// Controlador de Usuarios
import userService from '../services/user.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import logger from '../config/logger.js';

export const userController = {
  // GET /api/users/me/linked-center
  getMyLinkedCenter: asyncHandler(async (req, res) => {
    const center = await userService.getMyLinkedCenter(req.userId);

    res.status(200).json({
      success: true,
      data: center,
    });
  }),

  // POST /api/users/me/link-center/:centerId
  linkMeToCenter: asyncHandler(async (req, res) => {
    const { centerId } = req.params;
    const center = await userService.linkMeToCenter(req.userId, centerId);

    res.status(200).json({
      success: true,
      message: 'Centro vinculado correctamente',
      data: center,
    });
  }),

  // DELETE /api/users/me/link-center
  unlinkMeFromCenter: asyncHandler(async (req, res) => {
    const result = await userService.unlinkMeFromCenter(req.userId);

    res.status(200).json({
      success: true,
      message: 'Centro desvinculado correctamente',
      data: result,
    });
  }),

  // GET /api/users/:id (Perfil público)
  getPublicProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await userService.getPublicProfile(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // PUT /api/users/profile
  updateProfile: asyncHandler(async (req, res) => {
    const updateData = req.body;

    const user = await userService.updateProfile(req.userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado',
      data: user,
    });
  }),

  // GET /api/users/search/:query
  searchUsers: asyncHandler(async (req, res) => {
    const { query } = req.params;
    const role = req.query.role;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await userService.searchUsers(query, role, limit, offset);

    res.status(200).json({
      success: true,
      message: 'Búsqueda realizada',
      data: result,
    });
  }),

  // GET /api/users/:id/stats
  getUserStats: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const stats = await userService.getUserStats(id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  }),
};

export default userController;
