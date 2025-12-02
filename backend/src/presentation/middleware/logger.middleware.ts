import { FastifyReply, FastifyRequest } from 'fastify'
import { logger } from '../../shared/logger/winston.logger'

/**
 * Logger middleware
 * Logs all incoming requests
 */
export async function loggerMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const start = Date.now()

  reply.raw.on('finish', () => {
    const duration = Date.now() - start

    logger.info('Request completed', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      userId: request.user?.userId,
      ip: request.ip,
    })
  })
}
