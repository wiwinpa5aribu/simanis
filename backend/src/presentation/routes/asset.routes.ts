import { FastifyInstance } from 'fastify';
import { AssetController } from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function assetRoutes(fastify: FastifyInstance) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    fastify.get('/', AssetController.getAll);
    fastify.post('/', AssetController.create);
}
