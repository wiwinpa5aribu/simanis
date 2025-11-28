import { FastifyRequest } from 'fastify';
import { ForbiddenError } from '../../shared/errors/forbidden-error';

/**
 * RBAC middleware factory
 * Checks if user has required role
 */
export function rbacMiddleware(allowedRoles: string[]) {
    return async (request: FastifyRequest) => {
        const user = request.user;

        if (!user) {
            throw new ForbiddenError('Unauthorized');
        }

        const hasRole = user.roles.some((role) => allowedRoles.includes(role));

        if (!hasRole) {
            throw new ForbiddenError('Anda tidak memiliki akses untuk fitur ini');
        }
    };
}
