import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { GetAssetsUseCase } from '../../application/use-cases/assets/get-assets.use-case';
import { CreateAssetUseCase } from '../../application/use-cases/assets/create-asset.use-case';
import { AssetRepositoryImpl } from '../../infrastructure/database/repositories/asset.repository.impl';
import { createAssetSchema } from '../../application/validators/asset.validators';
import { ValidationError } from '../../shared/errors/validation-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { sanitizePaginationParams } from '../../shared/utils/pagination.utils';

const prisma = new PrismaClient();
const assetRepository = new AssetRepositoryImpl(prisma);

export class AssetController {
    /**
     * GET /api/assets
     */
    static async getAll(request: FastifyRequest, reply: FastifyReply) {
        const query = request.query as any;

        // Parse pagination
        const { page, pageSize } = sanitizePaginationParams(
            query.page ? parseInt(query.page) : undefined,
            query.pageSize ? parseInt(query.pageSize) : undefined
        );

        // Parse filters
        const filters = {
            categoryId: query.categoryId ? parseInt(query.categoryId) : undefined,
            kondisi: query.kondisi,
            search: query.search,
        };

        // Execute use case
        const getAssetsUseCase = new GetAssetsUseCase(assetRepository);
        const result = await getAssetsUseCase.execute({ page, pageSize, filters });

        return reply.status(200).send(createSuccessResponse(result.assets, result.meta));
    }

    /**
     * POST /api/assets
     */
    static async create(request: FastifyRequest, reply: FastifyReply) {
        // Validate input
        const result = createAssetSchema.safeParse(request.body);
        if (!result.success) {
            throw new ValidationError('Input tidak valid', result.error.errors);
        }

        const createdBy = request.user!.userId;

        // Execute use case
        const createAssetUseCase = new CreateAssetUseCase(assetRepository);
        const asset = await createAssetUseCase.execute(result.data, createdBy);

        return reply.status(201).send(createSuccessResponse(asset));
    }
}
