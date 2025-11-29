import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from '../../shared/errors/validation-error';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { UnauthorizedError } from '../../shared/errors/unauthorized-error';
import { ForbiddenError } from '../../shared/errors/forbidden-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { logger } from '../../shared/logger/winston.logger';
import { createErrorResponse } from '../../shared/utils/response.utils';

/**
 * Global error handler middleware
 */
export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Log error with context
  const errorContext = {
    path: request.url,
    method: request.method,
    userId: request.user?.id,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  };

  // Expected errors (business logic)
  if (error instanceof ValidationError) {
    logger.warn('Validation error', { ...errorContext, error: error.message });
    return reply
      .status(400)
      .send(createErrorResponse('VALIDATION_ERROR', error.message, error.details));
  }

  if (error instanceof UnauthorizedError) {
    logger.warn('Unauthorized', { ...errorContext, error: error.message });
    return reply.status(401).send(createErrorResponse('UNAUTHORIZED', error.message));
  }

  if (error instanceof ForbiddenError) {
    logger.warn('Forbidden', { ...errorContext, error: error.message });
    return reply.status(403).send(createErrorResponse('FORBIDDEN', error.message));
  }

  if (error instanceof NotFoundError) {
    logger.warn('Not found', { ...errorContext, error: error.message });
    return reply.status(404).send(createErrorResponse('NOT_FOUND', error.message));
  }

  if (error instanceof ConflictError) {
    logger.warn('Conflict', { ...errorContext, error: error.message });
    return reply.status(409).send(createErrorResponse('CONFLICT', error.message));
  }

  // Unexpected errors (bugs)
  logger.error('Unexpected error', {
    ...errorContext,
    error: error.message,
    stack: error.stack,
  });

  return reply
    .status(500)
    .send(createErrorResponse('INTERNAL_ERROR', 'Terjadi kesalahan pada server'));
}
