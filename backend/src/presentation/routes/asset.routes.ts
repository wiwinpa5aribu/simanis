import { FastifyInstance } from 'fastify';
import { AssetController } from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

export async function assetRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  fastify.get('/', AssetController.getAll);
  fastify.get('/:id', AssetController.getById);
  fastify.get('/by-code/:code', AssetController.getByCode);
  fastify.post('/', AssetController.create);
  fastify.put('/:id', AssetController.update);

  // Delete requires wakasek_sarpras or kepsek role
  fastify.delete('/:id', {
    preHandler: rbacMiddleware(['wakasek_sarpras', 'kepsek']),
    handler: AssetController.delete,
  });

  // Mutations (location changes)
  fastify.get('/:id/mutations', AssetController.getMutations);
  fastify.post('/:id/mutations', AssetController.createMutation);
}
