import { FastifyInstance } from 'fastify'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/login', AuthController.login)

  // Protected routes
  fastify.get(
    '/me',
    { preHandler: authMiddleware },
    AuthController.getCurrentUser
  )
}
