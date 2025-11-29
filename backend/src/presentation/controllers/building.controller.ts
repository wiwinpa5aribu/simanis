import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { ValidationError } from '../../shared/errors/validation-error';
import {
  createBuildingSchema,
  updateBuildingSchema,
} from '../../application/validators/location.validators';

const prisma = new PrismaClient();

export class BuildingController {
  /**
   * GET /api/buildings - Get all buildings with nested floors and rooms
   */
  static async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const buildings = await prisma.building.findMany({
      include: {
        floors: {
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
        },
      },
      orderBy: { name: 'asc' },
    });

    return reply.status(200).send(createSuccessResponse(buildings));
  }

  /**
   * GET /api/buildings/:id - Get building by ID with nested data
   */
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const buildingId = parseInt(id);

    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      include: {
        floors: {
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
        },
      },
    });

    if (!building) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }

    return reply.status(200).send(createSuccessResponse(building));
  }

  /**
   * POST /api/buildings - Create new building
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const result = createBuildingSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Data tidak valid', result.error.errors);
    }

    // Check for duplicate name
    const existing = await prisma.building.findUnique({
      where: { name: result.data.name },
    });
    if (existing) {
      throw new ConflictError('Nama gedung sudah digunakan');
    }

    const building = await prisma.building.create({
      data: { name: result.data.name },
      include: {
        floors: {
          include: { rooms: true },
        },
      },
    });

    return reply.status(201).send(createSuccessResponse(building));
  }

  /**
   * PUT /api/buildings/:id - Update building
   */
  static async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const buildingId = parseInt(id);

    const result = updateBuildingSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Data tidak valid', result.error.errors);
    }

    // Check if building exists
    const existing = await prisma.building.findUnique({
      where: { id: buildingId },
    });
    if (!existing) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }

    // Check for duplicate name (excluding current)
    const duplicate = await prisma.building.findFirst({
      where: {
        name: result.data.name,
        id: { not: buildingId },
      },
    });
    if (duplicate) {
      throw new ConflictError('Nama gedung sudah digunakan');
    }

    const building = await prisma.building.update({
      where: { id: buildingId },
      data: { name: result.data.name },
      include: {
        floors: {
          include: { rooms: true },
        },
      },
    });

    return reply.status(200).send(createSuccessResponse(building));
  }

  /**
   * DELETE /api/buildings/:id - Delete building
   */
  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const buildingId = parseInt(id);

    // Check if building exists
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      include: {
        floors: {
          include: {
            rooms: true,
          },
        },
      },
    });

    if (!building) {
      throw new NotFoundError('Gedung tidak ditemukan');
    }

    // Check if any room in this building has assets
    const roomIds = building.floors.flatMap((f) => f.rooms.map((r) => r.id));
    if (roomIds.length > 0) {
      const assetsInBuilding = await prisma.asset.count({
        where: {
          currentRoomId: { in: roomIds },
          isDeleted: false,
        },
      });

      if (assetsInBuilding > 0) {
        throw new ConflictError('Gedung tidak dapat dihapus karena masih memiliki aset');
      }
    }

    await prisma.building.delete({
      where: { id: buildingId },
    });

    return reply.status(200).send(createSuccessResponse({ deleted: true }));
  }
}
