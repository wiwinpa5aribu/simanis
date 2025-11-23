import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CreateInventoryUseCase } from '../../application/use-cases/inventory/create-inventory.use-case';
import { GetInventoryUseCase } from '../../application/use-cases/inventory/get-inventory.use-case';
import { InventoryRepositoryImpl } from '../../infrastructure/database/repositories/inventory.repository.impl';
import { AssetRepositoryImpl } from '../../infrastructure/database/repositories/asset.repository.impl';
import { AuditRepositoryImpl } from '../../infrastructure/database/repositories/audit.repository.impl';
import { createInventorySchema } from '../../application/validators/inventory.validators';
import { ValidationError } from '../../shared/errors/validation-error';
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
            auditRepository
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
        };

        // Parse pagination
        const { page, pageSize } = sanitizePaginationParams(
            query.page ? parseInt(query.page) : undefined,
            query.pageSize ? parseInt(query.pageSize) : undefined
        );

        // Parse filters
        const filters = {
            assetId: query.assetId ? parseInt(query.assetId) : undefined,
            checkerId: query.checkerId ? parseInt(query.checkerId) : undefined,
            condition: query.condition,
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
        };

        // Execute use case
        const getInventoryUseCase = new GetInventoryUseCase(inventoryRepository);
        const result = await getInventoryUseCase.execute({ page, pageSize, filters });

        return reply.status(200).send(createSuccessResponse(result.checks, result.meta));
    }
}
