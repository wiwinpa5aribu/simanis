import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CreateInventoryUseCase } from '../../application/use-cases/inventory/create-inventory.use-case';
import { GetInventoryUseCase } from '../../application/use-cases/inventory/get-inventory.use-case';
import { InventoryRepositoryImpl } from '../../infrastructure/database/repositories/inventory.repository.impl';
import { AssetRepositoryImpl } from '../../infrastructure/database/repositories/asset.repository.impl';
import { AuditRepositoryImpl } from '../../infrastructure/database/repositories/audit.repository.impl';
import { createInventorySchema } from '../../application/validators/inventory.validators';
import { ValidationError } from '../../shared/errors/validation-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { sanitizePaginationParams } from '../../shared/utils/pagination.utils';

const prisma = new PrismaClient();
const inventoryRepository = new InventoryRepositoryImpl(prisma);
const assetRepository = new AssetRepositoryImpl(prisma);
const auditRepository = new AuditRepositoryImpl(prisma);

export class InventoryController {
  /**
   * POST /api/inventory
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    // Validate input
    const result = createInventorySchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Input tidak valid', result.error.errors);
    }

    const checkerId = request.user!.userId;

    // Execute use case
    const createInventoryUseCase = new CreateInventoryUseCase(
      inventoryRepository,
      assetRepository,
      auditRepository,
    );
    const inventory = await createInventoryUseCase.execute(result.data, checkerId);

    return reply.status(201).send(createSuccessResponse(inventory));
  }

  /**
   * GET /api/inventory
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      page?: string;
      pageSize?: string;
      assetId?: string;
      checkerId?: string;
      condition?: string;
      startDate?: string;
      endDate?: string;
      from?: string;
      to?: string;
    };

    // Parse pagination
    const { page, pageSize } = sanitizePaginationParams(
      query.page ? parseInt(query.page) : undefined,
      query.pageSize ? parseInt(query.pageSize) : undefined,
    );

    // Parse filters - support both startDate/endDate and from/to
    const filters = {
      assetId: query.assetId ? parseInt(query.assetId) : undefined,
      checkerId: query.checkerId ? parseInt(query.checkerId) : undefined,
      condition: query.condition,
      startDate: query.startDate
        ? new Date(query.startDate)
        : query.from
          ? new Date(query.from)
          : undefined,
      endDate: query.endDate ? new Date(query.endDate) : query.to ? new Date(query.to) : undefined,
    };

    // Execute use case
    const getInventoryUseCase = new GetInventoryUseCase(inventoryRepository);
    const result = await getInventoryUseCase.execute({ page, pageSize, filters });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return reply.status(200).send(createSuccessResponse(result.checks, result.meta as any));
  }

  /**
   * GET /api/inventory/:id - Get inventory check by ID
   */
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const inventoryId = parseInt(id);

    const inventory = await prisma.inventoryCheck.findUnique({
      where: { id: inventoryId },
      include: {
        asset: {
          select: {
            id: true,
            kodeAset: true,
            namaBarang: true,
            merk: true,
            kondisi: true,
            fotoUrl: true,
          },
        },
        checker: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundError('Data inventaris tidak ditemukan');
    }

    return reply.status(200).send(createSuccessResponse(inventory));
  }
}
