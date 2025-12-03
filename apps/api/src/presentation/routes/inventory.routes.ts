import { FastifyInstance } from 'fastify'
import { InventoryController } from '../controllers/inventory.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function inventoryRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  /**
   * GET /api/inventory - Get all inventory checks with filters
   */
  fastify.get('/', InventoryController.getAll)

  /**
   * GET /api/inventory/:id - Get inventory check by ID
   */
  fastify.get('/:id', InventoryController.getById)

  /**
   * POST /api/inventory - Create new inventory check
   */
  fastify.post('/', InventoryController.create)
}
