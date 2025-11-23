import { FastifyInstance } from 'fastify';
import { AuditController } from '../controllers/audit.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function auditRoutes(fastify: FastifyInstance) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    fastify.get('/', AuditController.getAll);
}
