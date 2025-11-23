import { FastifyRequest, FastifyReply } from 'fastify';
import { jwtService } from '../../infrastructure/crypto/jwt.service';
import { UnauthorizedError } from '../../shared/errors/unauthorized-error';

// Extend Fastify request type to include user
declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            userId: number;
            username: string;
            roles: string[];
        };
    }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError('Token tidak ditemukan');
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = jwtService.verify(token);

        // Attach user to request
        request.user = payload;
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        throw new UnauthorizedError('Token tidak valid');
    }
}
