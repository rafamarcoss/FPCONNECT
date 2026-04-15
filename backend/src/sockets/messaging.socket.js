// Configuración de Socket.io para mensajería en tiempo real
import { Server } from 'socket.io';
import logger from '../config/logger.js';
import prisma from '../config/prisma.js';

export const initializeSocket = (server, config) => {
  const io = new Server(server, {
    cors: {
      origin: config.cors_origin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Almacenar usuarios conectados
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    logger.debug(`🔌 Socket conectado: ${socket.id}`);

    // ============ EVENTOS DE CONEXIÓN ============

    socket.on('user:connect', (userId) => {
      connectedUsers.set(userId, socket.id);
      logger.debug(`👤 Usuario ${userId} conectado (socket: ${socket.id})`);
      
      // Broadcast: usuario en línea
      io.emit('user:online', { userId });
    });

    // ============ MENSAJERÍA ============

    socket.on('message:send', async (data) => {
      try {
        const { conversationId, recipientId, content, senderId } = data;

        logger.debug(`💬 Mensaje de ${senderId} a ${recipientId}`);

        // Guardar en BD
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId,
            recipientId,
            content,
          },
        });

        // Enviar al destinatario si está en línea
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('message:received', {
            id: message.id,
            conversationId,
            senderId,
            content,
            createdAt: message.createdAt,
          });
        }

        socket.emit('message:sent', {
          id: message.id,
          status: 'sent',
        });
      } catch (error) {
        logger.error('Error al enviar mensaje:', error);
        socket.emit('message:error', { error: 'Error al enviar mensaje' });
      }
    });

    // Marcar mensaje como leído
    socket.on('message:read', async (data) => {
      try {
        const { messageId } = data;

        await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true, readAt: new Date() },
        });

        io.emit('message:updated', { messageId, isRead: true });
      } catch (error) {
        logger.error('Error al marcar como leído:', error);
      }
    });

    // ============ NOTIFICACIONES ============

    socket.on('notification:send', async (data) => {
      try {
        const { userId, type, title, message } = data;

        // Guardar notificación en BD
        const notification = await prisma.notification.create({
          data: {
            userId,
            type,
            title,
            message,
          },
        });

        // Enviar al usuario si está en línea
        const userSocketId = connectedUsers.get(userId);
        if (userSocketId) {
          io.to(userSocketId).emit('notification:received', {
            id: notification.id,
            type,
            title,
            message,
            createdAt: notification.createdAt,
          });
        }
      } catch (error) {
        logger.error('Error al enviar notificación:', error);
      }
    });

    // ============ ACTIVIDADES EN VIVO ============

    socket.on('post:created', (data) => {
      io.emit('post:new', data);
      logger.debug(`📝 Post creado: ${data.id}`);
    });

    socket.on('post:liked', (data) => {
      io.emit('post:liked', data);
    });

    socket.on('comment:added', (data) => {
      io.emit('comment:new', data);
    });

    // ============ DESCONEXIÓN ============

    socket.on('disconnect', () => {
      // Buscar y eliminar usuario
      let disconnectedUserId;
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          connectedUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        logger.debug(`👤 Usuario ${disconnectedUserId} desconectado`);
        io.emit('user:offline', { userId: disconnectedUserId });
      }

      logger.debug(`🔌 Socket desconectado: ${socket.id}`);
    });

    // ============ MANEJO DE ERRORES ============

    socket.on('error', (error) => {
      logger.error(`❌ Error de socket ${socket.id}:`, error);
    });
  });

  return io;
};

export default initializeSocket;
