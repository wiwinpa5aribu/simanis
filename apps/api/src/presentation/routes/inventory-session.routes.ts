import { FastifyInstance } from 'fastify'
import { InventorySessionController } from '../controllers/inventory-session.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function inventorySessionRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  /**
   * GET /api/inventory/sessions - Get all inventory sessions with filters
   */
  fastify.get('/', InventorySessionController.getAll)

  /**
   * GET /api/inventory/sessions/:id - Get session by ID with checks
   */
  fastify.get('/:id', InventorySessionController.getById)

  /**
   * POST /api/inventory/sessions - Create new inventory session
   */
  fastify.post('/', InventorySessionController.create)

  /**
   * GET /api/inventory/sessions/:id/check-status - Check if asset already checked
   */
  fastify.get('/:id/check-status', InventorySessionController.checkAssetStatus)

  /**
   * POST /api/inventory/sessions/:id/check - Check an asset in session
   */
  fastify.post('/:id/check', InventorySessionController.checkAsset)

  /**
   * GET /api/inventory/sessions/:id/summary - Get session summary
   */
  fastify.get('/:id/summary', InventorySessionController.getSummary)

  /**
   * POST /api/inventory/sessions/:id/complete - Complete session
   */
  fastify.post('/:id/complete', InventorySessionController.complete)

  /**
   * POST /api/inventory/sessions/:id/cancel - Cancel session
   */
  fastify.post('/:id/cancel', InventorySessionController.cancel)

  /**
   * GET /api/inventory/sessions/:id/report - Download report
   */
  fastify.get('/:id/report', InventorySessionController.downloadReport)
}
