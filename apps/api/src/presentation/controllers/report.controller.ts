import { PrismaClient } from '@simanis/database'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GenerateKibReportUseCase } from '../../application/use-cases/reports/generate-kib-report.use-case'

const prisma = new PrismaClient()

export class ReportController {
  /**
   * GET /api/reports/kib
   * Generates KIB Excel report
   */
  static async generateKib(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as {
      categoryId?: string
      year?: string
      roomId?: string
    }

    const filters = {
      categoryId: query.categoryId ? parseInt(query.categoryId) : undefined,
      year: query.year ? parseInt(query.year) : undefined,
      roomId: query.roomId ? parseInt(query.roomId) : undefined,
    }

    const generateKibReportUseCase = new GenerateKibReportUseCase(prisma)
    const buffer = await generateKibReportUseCase.execute(filters)

    // Set headers for file download
    reply.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    reply.header(
      'Content-Disposition',
      `attachment; filename="kib-report-${Date.now()}.xlsx"`
    )

    return reply.send(buffer)
  }
}
