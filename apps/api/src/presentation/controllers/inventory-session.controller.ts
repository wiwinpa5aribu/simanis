// Note: If TypeScript shows errors for inventorySession, restart the TS server
// The Prisma client is correctly generated with the new model
import { prisma } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { ValidationError } from '../../shared/errors/validation-error'
import {
  calculatePagination,
  sanitizePaginationParams,
} from '../../shared/utils/pagination.utils'
import { createSuccessResponse } from '../../shared/utils/response.utils'

export class InventorySessionController {
  /**
   * GET /api/inventory/sessions
   */
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      page?: string
      pageSize?: string
      lokasiId?: string
      status?: string
      tanggalMulai?: string
      tanggalSelesai?: string
    }

    const { page, pageSize } = sanitizePaginationParams(
      query.page ? Number.parseInt(query.page) : undefined,
      query.pageSize ? Number.parseInt(query.pageSize) : undefined
    )

    // Build where clause
    const where: {
      lokasiId?: number
      status?: string
      createdAt?: { gte?: Date; lte?: Date }
    } = {}

    if (query.lokasiId) where.lokasiId = Number.parseInt(query.lokasiId)
    if (query.status) where.status = query.status.toUpperCase()
    if (query.tanggalMulai || query.tanggalSelesai) {
      where.createdAt = {}
      if (query.tanggalMulai) where.createdAt.gte = new Date(query.tanggalMulai)
      if (query.tanggalSelesai)
        where.createdAt.lte = new Date(query.tanggalSelesai)
    }

    const [sessions, total] = await Promise.all([
      prisma.inventorySession.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { id: true, name: true, username: true } },
          lokasi: {
            select: {
              id: true,
              name: true,
              floor: {
                select: {
                  levelNumber: true,
                  building: { select: { name: true } },
                },
              },
            },
          },
          _count: { select: { checks: true } },
        },
      }),
      prisma.inventorySession.count({ where }),
    ])

    // Transform to frontend expected format
    const data = sessions.map((s) => ({
      id: s.id,
      lokasiId: s.lokasiId || 0,
      lokasiNama: s.lokasi
        ? `${s.lokasi.floor.building.name} - Lt.${s.lokasi.floor.levelNumber} - ${s.lokasi.name}`
        : 'Semua Lokasi',
      petugasId: s.createdBy,
      petugasNama: s.creator.name,
      catatan: s.deskripsi || '',
      status:
        s.status.toLowerCase() === 'aktif'
          ? 'berlangsung'
          : s.status.toLowerCase(),
      tanggalMulai: s.createdAt.toISOString(),
      tanggalSelesai: s.completedAt?.toISOString(),
      totalAset: 0,
      totalDicek: s._count.checks,
      totalBermasalah: 0,
    }))

    const meta = calculatePagination(total, page, pageSize)
    return reply.status(200).send(createSuccessResponse(data, meta))
  }

  /**
   * GET /api/inventory/sessions/:id
   */
  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const sessionId = Number.parseInt(id)

    const session = await prisma.inventorySession.findUnique({
      where: { id: sessionId },
      include: {
        creator: { select: { id: true, name: true, username: true } },
        lokasi: {
          select: {
            id: true,
            name: true,
            floor: {
              select: {
                levelNumber: true,
                building: { select: { name: true } },
              },
            },
          },
        },
        checks: {
          include: {
            asset: {
              select: {
                id: true,
                kodeAset: true,
                namaBarang: true,
                kondisi: true,
                fotoUrl: true,
              },
            },
            checker: { select: { id: true, name: true } },
          },
          orderBy: { checkedAt: 'desc' },
        },
      },
    })

    if (!session) {
      throw new NotFoundError('Sesi inventarisasi tidak ditemukan')
    }

    const data = {
      id: session.id,
      lokasiId: session.lokasiId,
      lokasiNama: session.lokasi
        ? `${session.lokasi.floor.building.name} - Lt.${session.lokasi.floor.levelNumber} - ${session.lokasi.name}`
        : 'Semua Lokasi',
      petugasId: session.createdBy,
      petugasNama: session.creator.name,
      catatan: session.deskripsi,
      status:
        session.status.toLowerCase() === 'aktif'
          ? 'berlangsung'
          : session.status.toLowerCase(),
      tanggalMulai: session.createdAt.toISOString(),
      tanggalSelesai: session.completedAt?.toISOString(),
      totalAset: 0,
      totalDicek: session.checks.length,
      totalBermasalah: session.checks.filter((c) => c.kondisi !== 'Baik')
        .length,
      hasilPengecekan: session.checks.map((c) => ({
        id: c.id,
        sessionId: c.sessionId,
        assetId: c.assetId,
        kodeAset: c.asset.kodeAset,
        namaBarang: c.asset.namaBarang,
        kondisiSebelum: c.asset.kondisi.toLowerCase().replace(' ', '_'),
        kondisiSesudah: c.kondisi.toLowerCase().replace(' ', '_'),
        kondisiBerubah: c.asset.kondisi !== c.kondisi,
        catatan: c.note,
        fotoBukti: c.photoUrl,
        dicekPada: c.checkedAt.toISOString(),
      })),
    }

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * POST /api/inventory/sessions
   */
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as {
      lokasiId?: number | string
      catatan?: string
      nama?: string
    }
    const userId = request.user!.userId

    // Parse lokasiId - can come as string from form
    const lokasiId = body.lokasiId
      ? typeof body.lokasiId === 'string'
        ? Number.parseInt(body.lokasiId)
        : body.lokasiId
      : null

    const session = await prisma.inventorySession.create({
      data: {
        nama:
          body.nama ||
          `Inventarisasi ${new Date().toLocaleDateString('id-ID')}`,
        deskripsi: body.catatan,
        lokasiId: lokasiId,
        createdBy: userId,
        status: 'AKTIF',
      },
      include: {
        creator: { select: { id: true, name: true, username: true } },
        lokasi: {
          select: {
            id: true,
            name: true,
            floor: {
              select: {
                levelNumber: true,
                building: { select: { name: true } },
              },
            },
          },
        },
      },
    })

    const data = {
      id: session.id,
      lokasiId: session.lokasiId || 0, // Frontend expects number, use 0 for "all locations"
      lokasiNama: session.lokasi
        ? `${session.lokasi.floor.building.name} - Lt.${session.lokasi.floor.levelNumber} - ${session.lokasi.name}`
        : 'Semua Lokasi',
      petugasId: session.createdBy,
      petugasNama: session.creator.name,
      catatan: session.deskripsi || '',
      status: 'berlangsung',
      tanggalMulai: session.createdAt.toISOString(),
      tanggalSelesai: undefined,
      totalAset: 0,
      totalDicek: 0,
      totalBermasalah: 0,
    }

    return reply.status(201).send(createSuccessResponse(data))
  }

  /**
   * GET /api/inventory/sessions/:id/check-status
   */
  static async checkAssetStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const { assetId } = request.query as { assetId: string }
    const sessionId = Number.parseInt(id)

    const check = await prisma.inventoryCheck.findFirst({
      where: {
        sessionId,
        assetId: Number.parseInt(assetId),
      },
    })

    return reply
      .status(200)
      .send(createSuccessResponse({ sudahDicek: !!check }))
  }

  /**
   * POST /api/inventory/sessions/:id/check
   */
  static async checkAsset(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const sessionId = Number.parseInt(id)
    const userId = request.user!.userId

    const body = request.body as {
      kodeAset: string
      kondisi: string
      catatan?: string
    }

    // Find session
    const session = await prisma.inventorySession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      throw new NotFoundError('Sesi inventarisasi tidak ditemukan')
    }

    if (session.status !== 'AKTIF') {
      throw new ValidationError(
        'Sesi inventarisasi sudah selesai atau dibatalkan'
      )
    }

    // Find asset by code
    const asset = await prisma.asset.findUnique({
      where: { kodeAset: body.kodeAset },
    })

    if (!asset) {
      throw new NotFoundError('Aset tidak ditemukan')
    }

    // Check if already checked
    const existingCheck = await prisma.inventoryCheck.findFirst({
      where: { sessionId, assetId: asset.id },
    })

    if (existingCheck) {
      throw new ValidationError('Aset sudah dicek dalam sesi ini')
    }

    // Map kondisi to database format
    const kondisiMap: Record<string, string> = {
      baik: 'Baik',
      rusak_ringan: 'Rusak Ringan',
      rusak_berat: 'Rusak Berat',
      hilang: 'Hilang',
    }
    const kondisiDb = kondisiMap[body.kondisi] || body.kondisi

    // Create check
    const check = await prisma.inventoryCheck.create({
      data: {
        sessionId,
        assetId: asset.id,
        checkedBy: userId,
        kondisi: kondisiDb,
        note: body.catatan,
        qrCodeScanned: body.kodeAset,
      },
      include: {
        asset: {
          select: {
            id: true,
            kodeAset: true,
            namaBarang: true,
            kondisi: true,
          },
        },
      },
    })

    // Update asset condition if changed
    if (asset.kondisi !== kondisiDb) {
      await prisma.asset.update({
        where: { id: asset.id },
        data: { kondisi: kondisiDb },
      })
    }

    const data = {
      id: check.id,
      sessionId: check.sessionId,
      assetId: check.assetId,
      kodeAset: check.asset.kodeAset,
      namaBarang: check.asset.namaBarang,
      kondisiSebelum: check.asset.kondisi.toLowerCase().replace(' ', '_'),
      kondisiSesudah: kondisiDb.toLowerCase().replace(' ', '_'),
      kondisiBerubah: check.asset.kondisi !== kondisiDb,
      catatan: check.note,
      fotoBukti: check.photoUrl,
      dicekPada: check.checkedAt.toISOString(),
    }

    return reply.status(201).send(createSuccessResponse(data))
  }

  /**
   * GET /api/inventory/sessions/:id/summary
   */
  static async getSummary(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const sessionId = Number.parseInt(id)

    const session = await prisma.inventorySession.findUnique({
      where: { id: sessionId },
      include: {
        checks: true,
        lokasi: true,
      },
    })

    if (!session) {
      throw new NotFoundError('Sesi inventarisasi tidak ditemukan')
    }

    // Count assets in location (if location-based)
    let totalAset = 0
    if (session.lokasiId) {
      totalAset = await prisma.asset.count({
        where: { currentRoomId: session.lokasiId, isDeleted: false },
      })
    } else {
      totalAset = await prisma.asset.count({ where: { isDeleted: false } })
    }

    const totalDicek = session.checks.length
    const totalBermasalah = session.checks.filter(
      (c) => c.kondisi !== 'Baik'
    ).length

    const data = {
      totalAset,
      totalDicek,
      totalBelumDicek: totalAset - totalDicek,
      totalBermasalah,
      persentaseSelesai:
        totalAset > 0 ? Math.round((totalDicek / totalAset) * 100) : 0,
    }

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * POST /api/inventory/sessions/:id/complete
   */
  static async complete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const sessionId = Number.parseInt(id)

    const session = await prisma.inventorySession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      throw new NotFoundError('Sesi inventarisasi tidak ditemukan')
    }

    if (session.status !== 'AKTIF') {
      throw new ValidationError(
        'Sesi inventarisasi sudah selesai atau dibatalkan'
      )
    }

    const updated = await prisma.inventorySession.update({
      where: { id: sessionId },
      data: {
        status: 'SELESAI',
        completedAt: new Date(),
      },
      include: {
        creator: { select: { id: true, name: true } },
        lokasi: {
          select: {
            id: true,
            name: true,
            floor: {
              select: {
                levelNumber: true,
                building: { select: { name: true } },
              },
            },
          },
        },
        _count: { select: { checks: true } },
      },
    })

    const data = {
      id: updated.id,
      lokasiId: updated.lokasiId,
      lokasiNama: updated.lokasi
        ? `${updated.lokasi.floor.building.name} - Lt.${updated.lokasi.floor.levelNumber} - ${updated.lokasi.name}`
        : 'Semua Lokasi',
      petugasId: updated.createdBy,
      petugasNama: updated.creator.name,
      catatan: updated.deskripsi,
      status: 'selesai',
      tanggalMulai: updated.createdAt.toISOString(),
      tanggalSelesai: updated.completedAt?.toISOString(),
      totalAset: 0,
      totalDicek: updated._count.checks,
      totalBermasalah: 0,
    }

    return reply.status(200).send(createSuccessResponse(data))
  }

  /**
   * POST /api/inventory/sessions/:id/cancel
   */
  static async cancel(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const { alasan } = request.body as { alasan: string }
    const sessionId = Number.parseInt(id)

    const session = await prisma.inventorySession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      throw new NotFoundError('Sesi inventarisasi tidak ditemukan')
    }

    if (session.status !== 'AKTIF') {
      throw new ValidationError(
        'Sesi inventarisasi sudah selesai atau dibatalkan'
      )
    }

    await prisma.inventorySession.update({
      where: { id: sessionId },
      data: {
        status: 'DIBATALKAN',
        cancelledAt: new Date(),
        alasanBatal: alasan,
      },
    })

    return reply
      .status(200)
      .send(createSuccessResponse({ message: 'Sesi berhasil dibatalkan' }))
  }

  /**
   * GET /api/inventory/sessions/:id/report
   */
  static async downloadReport(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const { format } = request.query as { format?: string }
    const sessionId = Number.parseInt(id)

    const session = await prisma.inventorySession.findUnique({
      where: { id: sessionId },
      include: {
        creator: { select: { name: true } },
        lokasi: {
          select: {
            name: true,
            floor: {
              select: {
                levelNumber: true,
                building: { select: { name: true } },
              },
            },
          },
        },
        checks: {
          include: {
            asset: {
              select: {
                kodeAset: true,
                namaBarang: true,
                merk: true,
                kondisi: true,
              },
            },
          },
        },
      },
    })

    if (!session) {
      throw new NotFoundError('Sesi inventarisasi tidak ditemukan')
    }

    // For now, return JSON. PDF/Excel generation can be added later
    if (format === 'excel' || format === 'pdf') {
      return reply.status(501).send({ error: 'Format belum didukung' })
    }

    return reply.status(200).send(createSuccessResponse(session))
  }
}
