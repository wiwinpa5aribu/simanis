import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CreateLoanUseCase } from '../../application/use-cases/loans/create-loan.use-case';
import { ReturnLoanUseCase } from '../../application/use-cases/loans/return-loan.use-case';
import { LoanRepositoryImpl } from '../../infrastructure/database/repositories/loan.repository.impl';
import { createLoanSchema, returnLoanSchema } from '../../application/validators/loan.validators';
import { ValidationError } from '../../shared/errors/validation-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';

const prisma = new PrismaClient();
const loanRepository = new LoanRepositoryImpl(prisma);

export class LoanController {
    /**
     * POST /api/loans
     */
    static async create(request: FastifyRequest, reply: FastifyReply) {
        // Validate input
        const result = createLoanSchema.safeParse(request.body);
        if (!result.success) {
            throw new ValidationError('Input tidak valid', result.error.errors);
        }

        // Execute use case
        const createLoanUseCase = new CreateLoanUseCase(loanRepository);
        const loan = await createLoanUseCase.execute(result.data);

        return reply.status(201).send(createSuccessResponse(loan));
    }

    /**
     * PATCH /api/loans/:id/return
     */
    static async returnLoan(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const loanId = parseInt(id);

        // Validate input
        const result = returnLoanSchema.safeParse(request.body);
        if (!result.success) {
            throw new ValidationError('Input tidak valid', result.error.errors);
        }

        // Execute use case
        const returnLoanUseCase = new ReturnLoanUseCase(loanRepository);
        const loan = await returnLoanUseCase.execute(loanId, result.data);

        return reply.status(200).send(createSuccessResponse(loan));
    }
}
