import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.routes';
import { assetRoutes } from './asset.routes';
import { loanRoutes } from './loan.routes';
import { uploadRoutes } from './upload.routes';
import { inventoryRoutes } from './inventory.routes';
import { dashboardRoutes } from './dashboard.routes';
import { depreciationRoutes } from './depreciation.routes';
import { reportRoutes } from './report.routes';
import { auditRoutes } from './audit.routes';
import { roomRoutes, floorRoomRoutes } from './room.routes';
import { userRoutes } from './user.routes';
import { buildingRoutes } from './building.routes';
import { floorRoutes, buildingFloorRoutes } from './floor.routes';

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
            await api.register(reportRoutes, { prefix: '/reports' });
            await api.register(auditRoutes, { prefix: '/audit' });
            await api.register(roomRoutes, { prefix: '/rooms' });
            await api.register(userRoutes, { prefix: '/users' });
            await api.register(buildingRoutes, { prefix: '/buildings' });
            await api.register(floorRoutes, { prefix: '/floors' });
            await api.register(buildingFloorRoutes, { prefix: '/buildings/:buildingId/floors' });
            await api.register(floorRoomRoutes, { prefix: '/floors/:floorId/rooms' });
        },
        { prefix: '/api' }
    );
}
