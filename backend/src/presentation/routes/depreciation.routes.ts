import { FastifyInstance } from 'fastify';
import { DepreciationController } from '../controllers/depreciation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function depreciationRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  fastify.get('/', DepreciationController.getAll);
}
