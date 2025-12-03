import { FastifyInstance } from 'fastify'
import { CategoryController } from '../controllers/category.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function categoryRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  fastify.get('/', CategoryController.getAll)
  fastify.post('/', CategoryController.create)
  
  // PUT /api/categories/:id/useful-life - Update default useful life for category
  fastify.put('/:id/useful-life', CategoryController.updateUsefulLife)
}
