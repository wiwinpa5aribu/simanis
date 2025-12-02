import { FastifyInstance } from 'fastify'
import { UploadController } from '../controllers/upload.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export async function uploadRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware)

  fastify.post('/asset-photo', UploadController.uploadAssetPhoto)
  fastify.post('/inventory-photo', UploadController.uploadInventoryPhoto)
  fastify.post('/document', UploadController.uploadDocument)
}
