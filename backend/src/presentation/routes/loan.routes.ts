import { FastifyInstance } from 'fastify';
import { LoanController } from '../controllers/loan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function loanRoutes(fastify: FastifyInstance) {
    // All routes require authentication
    fastify.addHook('preHandler', authMiddleware);

    fastify.post('/', LoanController.create);
    fastify.patch('/:id/return', LoanController.returnLoan);
}
