import { prisma } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ValidationError } from '../../shared/errors/validation-error'
import { createSuccessResponse } from '../../shared/utils/response.utils'

export class LocationController {
  /**
   * GET /api/locations - Get all locations as flat list for dropdown
   */
  static async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const rooms = await prisma.room.findMany({
      include: {
        floor: {
          include: {
            building: true,
          },
        },
        _count: {
          select: {
            mutationsTo: true, // Count assets currently in this room
          },
        },
      },
      orderBy: [
        { floor: { building: { name: 'asc' } } },
        { floor: { levelNumber: 'asc' } },
        { name: 'asc' },
      ],
    })

    // Count assets per room
    const assetCounts = await prisma.asset.groupBy({
      by: ['currentRoomId'],
      _count: { id: true },
      where: { isDeleted: false, currentRoomId: { not: null } },
    })

    const assetCountMap = new Map(
      assetCounts.map((ac) => [ac.currentRoomId, ac._count.id])
    )

    const data = rooms.map((room) => ({
      id: room.id,
      nama: `${room.floor.building.name} - Lt.${room.floor.levelNumber} - ${room.name}`,
      gedung: room.floor.building.name,
      lantai: room.floor.levelNumber,
      ruangan: room.name,
      kode: room.code,
      jumlahAset: assetCountMap.get(room.id) || 0,
    }))

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * GET /api/locations/buildings - Get all buildings
   */
  static async getBuildings(_request: FastifyRequest, reply: FastifyReply) {
    const buildings = await prisma.building.findMany({
      include: {
        _count: { select: { floors: true } },
      },
      orderBy: { name: 'asc' },
    })

    const data = buildings.map((b) => ({
      id: b.id,
      name: b.name,
      floorCount: b._count.floors,
    }))

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * POST /api/locations/buildings - Create building
   */
  static async createBuilding(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.body as { name: string }

    if (!name || name.trim().length === 0) {
      throw new ValidationError('Nama gedung wajib diisi')
    }

    const building = await prisma.building.create({
      data: { name: name.trim() },
    })

    return reply.status(201).send(createSuccessResponse(building))
  }

  /**
   * GET /api/locations/buildings/:buildingId/floors - Get floors in building
   */
  static async getFloors(request: FastifyRequest, reply: FastifyReply) {
    const { buildingId } = request.params as { buildingId: string }

    const floors = await prisma.floor.findMany({
      where: { buildingId: Number.parseInt(buildingId) },
      include: {
        _count: { select: { rooms: true } },
      },
      orderBy: { levelNumber: 'asc' },
    })

    const data = floors.map((f) => ({
      id: f.id,
      buildingId: f.buildingId,
      levelNumber: f.levelNumber,
      roomCount: f._count.rooms,
    }))

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * POST /api/locations/floors - Create floor
   */
  static async createFloor(request: FastifyRequest, reply: FastifyReply) {
    const { buildingId, levelNumber } = request.body as {
      buildingId: number
      levelNumber: number
    }

    if (!buildingId || !levelNumber) {
      throw new ValidationError('Building ID dan nomor lantai wajib diisi')
    }

    const floor = await prisma.floor.create({
      data: { buildingId, levelNumber },
    })

    return reply.status(201).send(createSuccessResponse(floor))
  }

  /**
   * GET /api/locations/floors/:floorId/rooms - Get rooms on floor
   */
  static async getRooms(request: FastifyRequest, reply: FastifyReply) {
    const { floorId } = request.params as { floorId: string }

    const rooms = await prisma.room.findMany({
      where: { floorId: Number.parseInt(floorId) },
      orderBy: { name: 'asc' },
    })

    const data = rooms.map((r) => ({
      id: r.id,
      floorId: r.floorId,
      name: r.name,
      code: r.code,
    }))

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * POST /api/locations/rooms - Create room
   */
  static async createRoom(request: FastifyRequest, reply: FastifyReply) {
    const { floorId, name, code } = request.body as {
      floorId: number
      name: string
      code?: string
    }

    if (!floorId || !name || name.trim().length === 0) {
      throw new ValidationError('Floor ID dan nama ruangan wajib diisi')
    }

    const room = await prisma.room.create({
      data: {
        floorId,
        name: name.trim(),
        code: code?.trim(),
      },
    })

    return reply.status(201).send(createSuccessResponse(room))
  }
}
