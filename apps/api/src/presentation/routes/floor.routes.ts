import { FastifyInstance } from 'fastify'
import { FloorController } from '../controllers/floor.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function floorRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  /**
   * PUT /api/floors/:id - Update floor
   */
  fastify.put('/:id', FloorController.update)

  /**
   * DELETE /api/floors/:id - Delete floor
   */
  fastify.delete('/:id', FloorController.delete)
}

/**
 * Floor routes nested under buildings
 * These are registered separately with prefix /api/buildings/:buildingId/floors
 */
export async function buildingFloorRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  /**
   * GET /api/buildings/:buildingId/floors - Get floors for a building
   */
  fastify.get('/', FloorController.getByBuilding)

  /**
   * POST /api/buildings/:buildingId/floors - Create floor in building
   */
  fastify.post('/', FloorController.create)
}
