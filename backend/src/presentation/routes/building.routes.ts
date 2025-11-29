import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth.middleware';
import { BuildingController } from '../controllers/building.controller';

export async function buildingRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  /**
   * GET /api/buildings - Get all buildings with floors and rooms
   */
  fastify.get('/', BuildingController.getAll);

  /**
   * GET /api/buildings/:id - Get building by ID
   */
  fastify.get('/:id', BuildingController.getById);

  /**
   * POST /api/buildings - Create new building
   */
  fastify.post('/', BuildingController.create);

  /**
   * PUT /api/buildings/:id - Update building
   */
  fastify.put('/:id', BuildingController.update);

  /**
   * DELETE /api/buildings/:id - Delete building
   */
  fastify.delete('/:id', BuildingController.delete);
}
