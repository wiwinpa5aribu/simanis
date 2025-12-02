import { FastifyInstance } from 'fastify'
import { DashboardController } from '../controllers/dashboard.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function dashboardRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  fastify.get('/stats', DashboardController.getStats)
  fastify.get('/activities', DashboardController.getActivities)
}
