import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateLoanUseCase } from '../../application/use-cases/loans/create-loan.use-case';
import { ReturnLoanUseCase } from '../../application/use-cases/loans/return-loan.use-case';
import { LoanRepositoryImpl } from '../../infrastructure/database/repositories/loan.repository.impl';
import { createLoanSchema, returnLoanSchema } from '../../application/validators/loan.validators';
import { ValidationError } from '../../shared/errors/validation-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import {
  sanitizePaginationParams,
  calculatePagination,
  calculateSkip,
} from '../../shared/utils/pagination.utils';

const prisma = new PrismaClient();
const loanRepository = new LoanRepositoryImpl(prisma);

export class LoanController {
  /**
   * GET /api/loans - Get all loans with filters
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      page?: string;
      pageSize?: string;
      status?: string;
      from?: string;
      to?: string;
    };

    // Parse pagination
    const { page, pageSize } = sanitizePaginationParams(
      query.page ? parseInt(query.page) : undefined,
      query.pageSize ? parseInt(query.pageSize) : undefined,
    );

    // Build where clause
    const where: Prisma.LoanWhereInput = {};

    // Status filter
    if (query.status) {
      where.status = query.status;
    }

    // Date range filter
    if (query.from || query.to) {
      where.tanggalPinjam = {};
      if (query.from) {
        where.tanggalPinjam.gte = new Date(query.from);
      }
      if (query.to) {
        where.tanggalPinjam.lte = new Date(query.to);
      }
    }

    // Get total count
    const totalItems = await prisma.loan.count({ where });

    const loans = await prisma.loan.findMany({
      where,
      include: {
        items: {
          include: {
            asset: { select: { id: true, kodeAset: true, namaBarang: true } },
          },
        },
        requester: { select: { id: true, name: true } },
      },
      skip: calculateSkip(page, pageSize),
      take: pageSize,
      orderBy: { tanggalPinjam: 'desc' },
    });

    const meta = calculatePagination(totalItems, page, pageSize);

    return reply.status(200).send(createSuccessResponse(loans, meta));
  }

  /**
   * GET /api/loans/:id - Get loan by ID with details
   */
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const loanId = parseInt(id);

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        items: {
          include: {
            asset: {
              select: {
                id: true,
                kodeAset: true,
                namaBarang: true,
                merk: true,
                kondisi: true,
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }

    return reply.status(200).send(createSuccessResponse(loan));
  }

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
