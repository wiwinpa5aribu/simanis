import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/get-current-user.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/repositories/user.repository.impl';
import { loginSchema } from '../../application/validators/auth.validators';
import { ValidationError } from '../../shared/errors/validation-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';

const prisma = new PrismaClient();
const userRepository = new UserRepositoryImpl(prisma);

export class AuthController {
  /**
   * POST /api/auth/login
   */
  static async login(request: FastifyRequest, reply: FastifyReply) {
    // Validate input
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError('Input tidak valid', result.error.errors);
    }

    const { username, password } = result.data;

    // Execute use case
    const loginUseCase = new LoginUseCase(userRepository);
    const response = await loginUseCase.execute(username, password);

    return reply.status(200).send(createSuccessResponse(response));
  }

  /**
   * GET /api/auth/me
   */
  static async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.userId;

    // Execute use case
    const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
    const user = await getCurrentUserUseCase.execute(userId);

    return reply.status(200).send(createSuccessResponse(user));
  }
}
