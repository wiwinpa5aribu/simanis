import { PrismaClient } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createRoomSchema,
  updateRoomSchema,
} from '../../application/validators/location.validators'
import { ConflictError } from '../../shared/errors/conflict-error'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { ValidationError } from '../../shared/errors/validation-error'
import { createSuccessResponse } from '../../shared/utils/response.utils'

const prisma = new PrismaClient()

export class RoomController {
  /**
   * GET /api/rooms - Get all rooms with building/floor info
   */
  static async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const rooms = await prisma.room.findMany({
      include: {
        floor: {
          include: { building: true },
        },
      },
      orderBy: [
        { floor: { building: { name: 'asc' } } },
        { floor: { levelNumber: 'asc' } },
        { name: 'asc' },
      ],
    })

    // Transform to simpler format for frontend
    const result = rooms.map((room) => ({
      id: room.id,
      name: `${room.floor.building.name} - Lt.${room.floor.levelNumber} - ${room.name}`,
      code: room.code,
      description: `${room.floor.building.name}, Lantai ${room.floor.levelNumber}`,
    }))

    return reply.status(200).send(createSuccessResponse(result))
  }

  /**
   * GET /api/rooms/:id - Get room by ID with floor and building info
   */
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const roomId = parseInt(id)

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        floor: {
          include: {
            building: {
              select: { id: true, name: true },
            },
          },
        },
      },
    })

    if (!room) {
      throw new NotFoundError('Ruangan tidak ditemukan')
    }

    const result = {
      id: room.id,
      name: room.name,
      code: room.code,
      floorId: room.floorId,
      floor: {
        levelNumber: room.floor.levelNumber,
        building: room.floor.building,
      },
    }

    return reply.status(200).send(createSuccessResponse(result))
  }

  /**
   * POST /api/floors/:floorId/rooms - Create room in floor
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const { floorId } = request.params as { floorId: string }
    const floorIdNum = parseInt(floorId)

    const result = createRoomSchema.safeParse(request.body)
    if (!result.success) {
      throw new ValidationError('Data tidak valid', result.error.errors)
    }

    // Check if floor exists
    const floor = await prisma.floor.findUnique({
      where: { id: floorIdNum },
    })
    if (!floor) {
      throw new NotFoundError('Lantai tidak ditemukan')
    }

    // Check for duplicate room name in same floor
    const existing = await prisma.room.findFirst({
      where: {
        floorId: floorIdNum,
        name: result.data.name,
      },
    })
    if (existing) {
      throw new ConflictError('Nama ruangan sudah ada di lantai ini')
    }

    const room = await prisma.room.create({
      data: {
        floorId: floorIdNum,
        name: result.data.name,
        code: result.data.code,
      },
      include: {
        floor: {
          include: {
            building: { select: { id: true, name: true } },
          },
        },
      },
    })

    return reply.status(201).send(createSuccessResponse(room))
  }

  /**
   * PUT /api/rooms/:id - Update room
   */
  static async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const roomId = parseInt(id)

    const result = updateRoomSchema.safeParse(request.body)
    if (!result.success) {
      throw new ValidationError('Data tidak valid', result.error.errors)
    }

    // Check if room exists
    const existing = await prisma.room.findUnique({
      where: { id: roomId },
    })
    if (!existing) {
      throw new NotFoundError('Ruangan tidak ditemukan')
    }

    // Check for duplicate room name in same floor (if name is being updated)
    if (result.data.name) {
      const duplicate = await prisma.room.findFirst({
        where: {
          floorId: existing.floorId,
          name: result.data.name,
          id: { not: roomId },
        },
      })
      if (duplicate) {
        throw new ConflictError('Nama ruangan sudah ada di lantai ini')
      }
    }

    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        name: result.data.name ?? existing.name,
        code: result.data.code !== undefined ? result.data.code : existing.code,
      },
      include: {
        floor: {
          include: {
            building: { select: { id: true, name: true } },
          },
        },
      },
    })

    return reply.status(200).send(createSuccessResponse(room))
  }

  /**
   * DELETE /api/rooms/:id - Delete room
   */
  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const roomId = parseInt(id)

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      throw new NotFoundError('Ruangan tidak ditemukan')
    }

    // Check if room has assets
    const assetsInRoom = await prisma.asset.findMany({
      where: {
        currentRoomId: roomId,
        isDeleted: false,
      },
      select: { id: true, kodeAset: true, namaBarang: true },
      take: 5,
    })

    if (assetsInRoom.length > 0) {
      const assetList = assetsInRoom
        .map((a) => `${a.kodeAset} - ${a.namaBarang}`)
        .join(', ')
      throw new ConflictError(
        `Ruangan tidak dapat dihapus karena masih memiliki aset: ${assetList}`
      )
    }

    await prisma.room.delete({
      where: { id: roomId },
    })

    return reply.status(200).send(createSuccessResponse({ deleted: true }))
  }
}
