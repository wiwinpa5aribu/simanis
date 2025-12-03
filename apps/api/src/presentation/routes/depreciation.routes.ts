import { FastifyInstance } from 'fastify'
import { DepreciationController } from '../controllers/depreciation.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function depreciationRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  // GET /api/depreciation - Get all depreciation entries
  fastify.get('/', DepreciationController.getAll)

  // GET /api/depreciation/summary - Get depreciation summary
  fastify.get('/summary', DepreciationController.getSummary)

  // GET /api/depreciation/list - Get depreciation list with asset info
  fastify.get('/list', DepreciationController.getList)

  // GET /api/depreciation/trend - Get depreciation trend data
  fastify.get('/trend', DepreciationController.getTrend)

  // GET /api/depreciation/asset/:id/history - Get asset depreciation history
  fastify.get('/asset/:id/history', DepreciationController.getAssetHistory)

  // POST /api/depreciation/calculate - Calculate depreciation for a period
  fastify.post('/calculate', DepreciationController.calculate)
}
