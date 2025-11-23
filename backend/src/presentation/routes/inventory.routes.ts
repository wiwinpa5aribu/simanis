import { FastifyInstance } from 'fastify';
import { InventoryController } from '../controllers/inventory.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function inventoryRoutes(fastify: FastifyInstance) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    fastify.post('/', InventoryController.create);
    fastify.get('/', InventoryController.getAll);
}
