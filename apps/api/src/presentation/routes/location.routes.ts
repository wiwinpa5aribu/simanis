import { FastifyInstance } from 'fastify'
import { LocationController } from '../controllers/location.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function locationRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  /**
   * GET /api/locations - Get all locations (hierarchical)
   */
  fastify.get('/', LocationController.getAll)

  /**
   * GET /api/locations/buildings - Get all buildings
   */
  fastify.get('/buildings', LocationController.getBuildings)

  /**
   * POST /api/locations/buildings - Create building
   */
  fastify.post('/buildings', LocationController.createBuilding)

  /**
   * GET /api/locations/buildings/:buildingId/floors - Get floors in building
   */
  fastify.get('/buildings/:buildingId/floors', LocationController.getFloors)

  /**
   * POST /api/locations/floors - Create floor
   */
  fastify.post('/floors', LocationController.createFloor)

  /**
   * GET /api/locations/floors/:floorId/rooms - Get rooms on floor
   */
  fastify.get('/floors/:floorId/rooms', LocationController.getRooms)

  /**
   * POST /api/locations/rooms - Create room
   */
  fastify.post('/rooms', LocationController.createRoom)
}
