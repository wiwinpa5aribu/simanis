import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function reportRoutes(fastify: FastifyInstance) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    fastify.get('/kib', ReportController.generateKib);
}
