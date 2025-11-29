import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import {
  sanitizePaginationParams,
  calculatePagination,
  calculateSkip,
} from '../../shared/utils/pagination.utils';
import { NotFoundError } from '../../shared/errors/not-found-error';

const prisma = new PrismaClient();

export class UserController {
  /**
   * GET /api/users - Get all users with pagination and search
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      search?: string;
      page?: string;
      pageSize?: string;
    };

    // Parse pagination
    const { page, pageSize } = sanitizePaginationParams(
      query.page ? parseInt(query.page) : undefined,
      query.pageSize ? parseInt(query.pageSize) : undefined,
    );

    // Build where clause for search
    const where = query.search
      ? {
          OR: [{ name: { contains: query.search } }, { username: { contains: query.search } }],
        }
      : {};

    // Get total count
    const totalItems = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: { name: true },
            },
          },
        },
      },
      skip: calculateSkip(page, pageSize),
      take: pageSize,
      orderBy: { name: 'asc' },
    });

    // Transform to include roles as string array
    const result = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      createdAt: user.createdAt.toISOString(),
    }));

    const meta = calculatePagination(totalItems, page, pageSize);

    return reply.status(200).send(createSuccessResponse(result, meta));
  }

  /**
   * GET /api/users/:id - Get user by ID
   */
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    const result = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
      createdAt: user.createdAt.toISOString(),
    };

    return reply.status(200).send(createSuccessResponse(result));
  }
}
