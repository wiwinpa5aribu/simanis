import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { GetAssetsUseCase } from '../../application/use-cases/assets/get-assets.use-case';
import { CreateAssetUseCase } from '../../application/use-cases/assets/create-asset.use-case';
import { UpdateAssetUseCase } from '../../application/use-cases/assets/update-asset.use-case';
import { AssetRepositoryImpl } from '../../infrastructure/database/repositories/asset.repository.impl';
import { AuditRepositoryImpl } from '../../infrastructure/database/repositories/audit.repository.impl';
import { AssetCodeGeneratorService } from '../../infrastructure/services/asset-code-generator.service';
import {
  createAssetSchema,
  updateAssetSchema,
} from '../../application/validators/asset.validators';
import { ValidationError } from '../../shared/errors/validation-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { sanitizePaginationParams } from '../../shared/utils/pagination.utils';

const prisma = new PrismaClient();
const assetRepository = new AssetRepositoryImpl(prisma);
const auditRepository = new AuditRepositoryImpl(prisma);
const assetCodeGenerator = new AssetCodeGeneratorService(prisma);

export class AssetController {
  /**
   * GET /api/assets
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Record<string, string | undefined>;

    const { page, pageSize } = sanitizePaginationParams(
      query.page ? parseInt(query.page) : undefined,
      query.pageSize ? parseInt(query.pageSize) : undefined,
    );

    const filters = {
      categoryId: query.categoryId ? parseInt(query.categoryId) : undefined,
      kondisi: query.kondisi,
      search: query.search,
    };

    const getAssetsUseCase = new GetAssetsUseCase(assetRepository);
    const result = await getAssetsUseCase.execute({ page, pageSize, filters });

    return reply.status(200).send(createSuccessResponse(result.assets, result.meta));
  }

  /**
   * POST /api/assets
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const result = createAssetSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Input tidak valid', result.error.errors);
    }

    const createdBy = request.user!.userId;
    const createAssetUseCase = new CreateAssetUseCase(assetRepository, assetCodeGenerator);
    const asset = await createAssetUseCase.execute(result.data, createdBy);

    return reply.status(201).send(createSuccessResponse(asset));
  }

  /**
   * GET /api/assets/:id
   */
  static async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!asset) {
      throw new NotFoundError('Aset tidak ditemukan');
    }

    return reply.status(200).send(createSuccessResponse(asset));
  }

  /**
   * GET /api/assets/by-code/:code
   */
  static async getByCode(
    request: FastifyRequest<{ Params: { code: string } }>,
    reply: FastifyReply,
  ) {
    const { code } = request.params;
    const asset = await prisma.asset.findUnique({
      where: { kodeAset: code },
      include: { category: true },
    });

    if (!asset) {
      throw new NotFoundError('Aset tidak ditemukan');
    }

    return reply.status(200).send(createSuccessResponse(asset));
  }

  /**
   * PUT /api/assets/:id
   */
  static async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;

    const result = updateAssetSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Input tidak valid', result.error.errors);
    }

    const updatedBy = request.user!.userId;
    const updateAssetUseCase = new UpdateAssetUseCase(assetRepository, auditRepository);
    const asset = await updateAssetUseCase.execute(parseInt(id), result.data, updatedBy);

    // Fetch with category relation
    const assetWithCategory = await prisma.asset.findUnique({
      where: { id: asset.id },
      include: { category: true },
    });

    return reply.status(200).send(createSuccessResponse(assetWithCategory));
  }

  /**
   * DELETE /api/assets/:id
   * Requires: wakasek_sarpras or kepsek role
   * Body: { beritaAcaraUrl: string }
   */
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const { beritaAcaraUrl } = request.body as { beritaAcaraUrl?: string };
    const deletedBy = request.user!.userId;

    // Import use case lazily to avoid circular deps
    const { DeleteAssetUseCase } = await import(
      '../../application/use-cases/assets/delete-asset.use-case'
    );

    const deleteAssetUseCase = new DeleteAssetUseCase(assetRepository, auditRepository);
    await deleteAssetUseCase.execute(
      parseInt(id),
      { beritaAcaraUrl: beritaAcaraUrl || '' },
      deletedBy,
    );

    return reply.status(200).send(createSuccessResponse({ message: 'Aset berhasil dihapus' }));
  }

  /**
   * GET /api/assets/:id/mutations
   */
  static async getMutations(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    const mutations = await prisma.assetMutation.findMany({
      where: { assetId: parseInt(id) },
      include: { fromRoom: true, toRoom: true },
      orderBy: { mutatedAt: 'desc' },
    });

    return reply.status(200).send(createSuccessResponse(mutations));
  }

  /**
   * POST /api/assets/:id/mutations
   */
  static async createMutation(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const { toRoomId, note } = request.body as { toRoomId: number; note?: string };

    const asset = await prisma.asset.findUnique({ where: { id: parseInt(id) } });
    if (!asset) {
      throw new NotFoundError('Aset tidak ditemukan');
    }

    const mutation = await prisma.assetMutation.create({
      data: {
        assetId: parseInt(id),
        fromRoomId: asset.currentRoomId,
        toRoomId,
        note,
      },
      include: { fromRoom: true, toRoom: true },
    });

    // Update asset location
    await prisma.asset.update({
      where: { id: parseInt(id) },
      data: { currentRoomId: toRoomId },
    });

    return reply.status(201).send(createSuccessResponse(mutation));
  }
}
