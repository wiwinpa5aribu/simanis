import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { config } from '../../shared/config'
import { logger } from '../../shared/logger/winston.logger'
import { IStorageService, UploadResult } from './storage.interface'

/**
 * Cloudflare R2 storage service for production
 * Uses S3-compatible API
 */
export class R2StorageService implements IStorageService {
  private client: S3Client
  private bucketName: string
  private publicUrl: string

  constructor() {
    this.bucketName = config.r2.bucketName ?? ''
    this.publicUrl = config.r2.publicUrl ?? ''

    this.client = new S3Client({
      region: 'auto',
      endpoint: config.r2.endpoint ?? '',
      credentials: {
        accessKeyId: config.r2.accessKeyId ?? '',
        secretAccessKey: config.r2.secretAccessKey ?? '',
      },
    })
  }

  async upload(
    file: Buffer,
    filename: string,
    mimetype: string
  ): Promise<UploadResult> {
    // Generate unique key
    const timestamp = Date.now()
    const key = `${timestamp}-${filename}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimetype,
    })

    await this.client.send(command)

    logger.info('File uploaded to R2', { key, size: file.length })

    return {
      url: `${this.publicUrl}/${key}`,
      key,
      size: file.length,
    }
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    try {
      await this.client.send(command)
      logger.info('File deleted from R2', { key })
    } catch (error) {
      logger.warn('Failed to delete file from R2', { key, error })
    }
  }

  getUrl(key: string): string {
    return `${this.publicUrl}/${key}`
  }
}
