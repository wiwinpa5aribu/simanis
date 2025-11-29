import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { ValidationError } from '../../shared/errors/validation-error';
import {
  createFloorSchema,
  updateFloorSchema,
} from '../../application/validators/location.validators';

const prisma = new PrismaClient();

export class FloorController {
  /**
   * GET /api/buildings/:buildingId/floors - Get floors for a building
   */
  static async getByBuilding(request: FastifyRequest, reply: FastifyReply) {
    const { buildingId } = request.params as { buildingId: string };
    const buildingIdNum = parseInt(buildingId);

    // Check if building exists
    const building = await prisma.building.findUnique({
      where: { id: buildingIdNum },
    });
    if (!building) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }

    const floors = await prisma.floor.findMany({
      where: { buildingId: buildingIdNum },
      include: {
        rooms: {
          select: {
            id: true,
            name: true,
            code: true,
            floorId: true,
          },
        },
      },
      orderBy: { levelNumber: 'asc' },
    });

    return reply.status(200).send(createSuccessResponse(floors));
  }

  /**
   * POST /api/buildings/:buildingId/floors - Create floor in building
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const { buildingId } = request.params as { buildingId: string };
    const buildingIdNum = parseInt(buildingId);

    const result = createFloorSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Data tidak valid', result.error.errors);
    }

    // Check if building exists
    const building = await prisma.building.findUnique({
      where: { id: buildingIdNum },
    });
    if (!building) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }

    // Check for duplicate level number in same building
    const existing = await prisma.floor.findFirst({
      where: {
        buildingId: buildingIdNum,
        levelNumber: result.data.levelNumber,
      },
    });
    if (existing) {
      throw new ConflictError('Nomor lantai sudah ada di gedung ini');
    }

    const floor = await prisma.floor.create({
      data: {
        buildingId: buildingIdNum,
        levelNumber: result.data.levelNumber,
      },
      include: {
        rooms: true,
      },
    });

    return reply.status(201).send(createSuccessResponse(floor));
  }

  /**
   * PUT /api/floors/:id - Update floor
   */
  static async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const floorId = parseInt(id);

    const result = updateFloorSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Data tidak valid', result.error.errors);
    }

    // Check if floor exists
    const existing = await prisma.floor.findUnique({
      where: { id: floorId },
    });
    if (!existing) {
      throw new NotFoundError('Lantai tidak ditemukan');
    }

    // Check for duplicate level number in same building (excluding current)
    const duplicate = await prisma.floor.findFirst({
      where: {
        buildingId: existing.buildingId,
        levelNumber: result.data.levelNumber,
        id: { not: floorId },
      },
    });
    if (duplicate) {
      throw new ConflictError('Nomor lantai sudah ada di gedung ini');
    }

    const floor = await prisma.floor.update({
      where: { id: floorId },
      data: { levelNumber: result.data.levelNumber },
      include: {
        rooms: true,
      },
    });

    return reply.status(200).send(createSuccessResponse(floor));
  }

  /**
   * DELETE /api/floors/:id - Delete floor
   */
  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const floorId = parseInt(id);

    // Check if floor exists with rooms
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
      include: { rooms: true },
    });

    if (!floor) {
      throw new NotFoundError('Lantai tidak ditemukan');
    }

    // Check if any room in this floor has assets
    const roomIds = floor.rooms.map((r) => r.id);
    if (roomIds.length > 0) {
      const assetsInFloor = await prisma.asset.count({
        where: {
          currentRoomId: { in: roomIds },
          isDeleted: false,
        },
      });

      if (assetsInFloor > 0) {
        throw new ConflictError('Lantai tidak dapat dihapus karena masih memiliki aset');
      }
    }

    await prisma.floor.delete({
      where: { id: floorId },
    });

    return reply.status(200).send(createSuccessResponse({ deleted: true }));
  }
}
