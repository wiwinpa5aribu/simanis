import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { LocalStorageService } from '../../infrastructure/storage/local-storage.service';
import { R2StorageService } from '../../infrastructure/storage/r2-storage.service';
import { IStorageService } from '../../infrastructure/storage/storage.interface';
import { config } from '../../shared/config';
import { ValidationError } from '../../shared/errors/validation-error';
import { createSuccessResponse } from '../../shared/utils/response.utils';
import { logger } from '../../shared/logger/winston.logger';

// Initialize storage service based on environment
const storageService: IStorageService =
    config.env === 'production' ? new R2StorageService() : new LocalStorageService();

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class UploadController {
    /**
     * POST /api/upload/asset-photo
     */
    static async uploadAssetPhoto(request: FastifyRequest, reply: FastifyReply) {
        const data = await request.file();

        if (!data) {
            throw new ValidationError('No file uploaded');
        }

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(data.mimetype)) {
            throw new ValidationError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
        }

        // Validate file size
        const buffer = await data.toBuffer();
        if (buffer.length > MAX_FILE_SIZE) {
            throw new ValidationError('File size exceeds 5MB limit');
        }

        // Upload file
        const result = await storageService.upload(buffer, data.filename, data.mimetype);

        logger.info('Asset photo uploaded', {
            filename: data.filename,
            size: result.size,
            userId: request.user?.userId,
        });

        return reply.status(201).send(createSuccessResponse(result));
    }

    /**
     * POST /api/upload/inventory-photo
     */
    static async uploadInventoryPhoto(request: FastifyRequest, reply: FastifyReply) {
        const data = await request.file();

        if (!data) {
            throw new ValidationError('No file uploaded');
        }

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(data.mimetype)) {
            throw new ValidationError('Invalid file type. Only JPEG, PNG, and WebP are allowed');
        }

        // Validate file size
        const buffer = await data.toBuffer();
        if (buffer.length > MAX_FILE_SIZE) {
            throw new ValidationError('File size exceeds 5MB limit');
        }

        // Upload file
        const result = await storageService.upload(buffer, data.filename, data.mimetype);

        logger.info('Inventory photo uploaded', {
            filename: data.filename,
            size: result.size,
            userId: request.user?.userId,
        });

        return reply.status(201).send(createSuccessResponse(result));
    }

    /**
     * POST /api/upload/document
     */
    static async uploadDocument(request: FastifyRequest, reply: FastifyReply) {
        const data = await request.file();

        if (!data) {
            throw new ValidationError('No file uploaded');
        }

        // Validate file type
        if (!ALLOWED_DOCUMENT_TYPES.includes(data.mimetype)) {
            throw new ValidationError('Invalid file type. Only PDF and Word documents are allowed');
        }

        // Validate file size
        const buffer = await data.toBuffer();
        if (buffer.length > MAX_FILE_SIZE) {
            throw new ValidationError('File size exceeds 5MB limit');
        }

        // Upload file
        const result = await storageService.upload(buffer, data.filename, data.mimetype);

        logger.info('Document uploaded', {
            filename: data.filename,
            size: result.size,
            userId: request.user?.userId,
        });

        return reply.status(201).send(createSuccessResponse(result));
    }
}
