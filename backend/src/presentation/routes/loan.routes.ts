import { FastifyInstance } from 'fastify';
import { LoanController } from '../controllers/loan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function loanRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  /**
   * GET /api/loans - Get all loans with filters
   */
  fastify.get('/', LoanController.getAll);

  /**
   * GET /api/loans/:id - Get loan by ID
   */
  fastify.get('/:id', LoanController.getById);

  /**
   * POST /api/loans - Create new loan
   */
  fastify.post('/', LoanController.create);

  /**
   * PUT/PATCH /api/loans/:id/return - Return loan
   */
  fastify.put('/:id/return', LoanController.returnLoan);
  fastify.patch('/:id/return', LoanController.returnLoan);
}
