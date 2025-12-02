import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function userRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  /**
   * GET /api/users - Get all users with pagination and search
   */
  fastify.get('/', UserController.getAll)

  /**
   * GET /api/users/:id - Get user by ID
   */
  fastify.get('/:id', UserController.getById)
}
