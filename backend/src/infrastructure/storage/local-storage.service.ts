import fs from 'fs/promises'
import path from 'path'
import { logger } from '../../shared/logger/winston.logger'
import { IStorageService, UploadResult } from './storage.interface'

/**
 * Local storage service for development
 * Saves files to ./uploads directory
 */
export class LocalStorageService implements IStorageService {
  private uploadDir: string
  private baseUrl: string

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads')
    this.baseUrl = 'http://localhost:3000/uploads'
    this.ensureUploadDir()
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir)
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true })
      logger.info('Created uploads directory', { path: this.uploadDir })
    }
  }

  async upload(file: Buffer, filename: string): Promise<UploadResult> {
    // Generate unique filename
    const timestamp = Date.now()
    const ext = path.extname(filename)
    const basename = path.basename(filename, ext)
    const key = `${basename}-${timestamp}${ext}`
    const filepath = path.join(this.uploadDir, key)

    // Save file
    await fs.writeFile(filepath, file)

    logger.info('File uploaded to local storage', { key, size: file.length })

    return {
      url: `${this.baseUrl}/${key}`,
      key,
      size: file.length,
    }
  }

  async delete(key: string): Promise<void> {
    const filepath = path.join(this.uploadDir, key)
    try {
      await fs.unlink(filepath)
      logger.info('File deleted from local storage', { key })
    } catch (error) {
      logger.warn('Failed to delete file', { key, error })
    }
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/${key}`
  }
}
