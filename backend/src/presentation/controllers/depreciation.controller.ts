import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { GetDepreciationUseCase } from '../../application/use-cases/depreciation/get-depreciation.use-case';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { sanitizePaginationParams } from '../../shared/utils/pagination.utils';

const prisma = new PrismaClient();

export class DepreciationController {
    /**
     * GET /api/depreciation
     */
    static async getAll(request: FastifyRequest, reply: FastifyReply) {
        const query = request.query as {
            page?: string;
            pageSize?: string;
            assetId?: string;
            year?: string;
        };

        // Parse pagination
        const { page, pageSize } = sanitizePaginationParams(
            query.page ? parseInt(query.page) : undefined,
            query.pageSize ? parseInt(query.pageSize) : undefined
        );

        // Parse filters
        const filters = {
            assetId: query.assetId ? parseInt(query.assetId) : undefined,
            year: query.year ? parseInt(query.year) : undefined,
        };

        // Execute use case
        const getDepreciationUseCase = new GetDepreciationUseCase(prisma);
        const result = await getDepreciationUseCase.execute({ page, pageSize, filters });

        return reply.status(200).send(createSuccessResponse(result.entries, result.meta));
    }
}
