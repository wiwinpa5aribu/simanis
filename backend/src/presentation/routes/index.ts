import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { assetRoutes } from './asset.routes';
import { loanRoutes } from './loan.routes';
import { uploadRoutes } from './upload.routes';
import { inventoryRoutes } from './inventory.routes';
import { dashboardRoutes } from './dashboard.routes';
import { depreciationRoutes } from './depreciation.routes';

/**
 * Register all API routes
 */
export async function registerRoutes(fastify: FastifyInstance) {
    // API prefix
    await fastify.register(
        async (api) => {
            // Register all routes
            await api.register(authRoutes, { prefix: '/auth' });
            await api.register(categoryRoutes, { prefix: '/categories' });
            await api.register(assetRoutes, { prefix: '/assets' });
            await api.register(loanRoutes, { prefix: '/loans' });
            await api.register(uploadRoutes, { prefix: '/upload' });
            await api.register(inventoryRoutes, { prefix: '/inventory' });
            await api.register(dashboardRoutes, { prefix: '/dashboard' });
            await api.register(depreciationRoutes, { prefix: '/depreciation' });
        },
        { prefix: '/api' }
    );
}
