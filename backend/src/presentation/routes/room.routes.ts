import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { RoomController } from '../controllers/room.controller';

export async function roomRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  /**
   * GET /api/rooms - Get all rooms with building/floor info
   */
  fastify.get('/', RoomController.getAll);

  /**
   * GET /api/rooms/:id - Get room by ID
   */
  fastify.get('/:id', RoomController.getById);

  /**
   * PUT /api/rooms/:id - Update room
   */
  fastify.put('/:id', RoomController.update);

  /**
   * DELETE /api/rooms/:id - Delete room
   */
  fastify.delete('/:id', RoomController.delete);
}

/**
 * Room routes nested under floors
 * These are registered separately with prefix /api/floors/:floorId/rooms
 */
export async function floorRoomRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  /**
   * POST /api/floors/:floorId/rooms - Create room in floor
   */
  fastify.post('/', RoomController.create);
}
