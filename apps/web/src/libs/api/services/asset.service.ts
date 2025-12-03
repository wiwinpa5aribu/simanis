/**
 * Asset Service - HTTP Adapter
 * Service layer untuk operasi aset menggunakan HTTP/REST API
 */

import { ERROR_MESSAGES } from '../../../constants'
import { getErrorMessage } from '../../utils/errorHandling'
import { logger } from '../../utils/logger'
import { api } from '../client'
import type {
  Asset,
  AssetFilters,
  AssetMutation,
  CreateAssetData,
  IAssetService,
  PaginatedResponse,
  UpdateAssetData,
} from './types'

class HttpAssetService implements IAssetService {
  /**
   * Get all assets with pagination and filters
   */
  async getAll(filters?: AssetFilters): Promise<PaginatedResponse<Asset>> {
    try {
      logger.info(
        'AssetService',
        'Fetching assets',
        filters as Record<string, unknown>
      )

      const response = await api.get<Asset[]>('/assets', { params: filters })
      const data = Array.isArray(response.data) ? response.data : []
      const meta = (
        response as unknown as { meta?: PaginatedResponse<Asset>['meta'] }
      ).meta

      logger.success('AssetService', `Fetched ${data.length} assets`)

      return {
        data,
        meta: meta || {
          page: filters?.page || 1,
          pageSize: filters?.pageSize || 10,
          total: data.length,
          totalPages: 1,
        },
      }
    } catch (error) {
      logger.error('AssetService', 'Failed to fetch assets', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get asset by ID
   */
  async getById(id: number): Promise<Asset> {
    try {
      logger.info('AssetService', `Fetching asset ID: ${id}`)
      const response = await api.get<Asset>(`/assets/${id}`)
      logger.success(
        'AssetService',
        `Fetched asset: ${response.data.namaBarang}`
      )
      return response.data
    } catch (error) {
      logger.error('AssetService', `Failed to fetch asset ID: ${id}`, error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
    }
  }

  /**
   * Get asset by code
   */
  async getByCode(code: string): Promise<Asset> {
    try {
      logger.info('AssetService', `Fetching asset code: ${code}`)
      const response = await api.get<Asset>(
        `/assets/by-code/${encodeURIComponent(code)}`
      )
      logger.success(
        'AssetService',
        `Fetched asset: ${response.data.namaBarang}`
      )
      return response.data
    } catch (error) {
      logger.error('AssetService', `Failed to fetch asset code: ${code}`, error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
    }
  }

  /**
   * Create new asset
   */
  async create(data: CreateAssetData): Promise<Asset> {
    try {
      logger.info('AssetService', 'Creating asset', { name: data.namaBarang })
      const response = await api.post<Asset>('/assets', data)
      logger.success(
        'AssetService',
        `Created asset: ${response.data.namaBarang}`
      )
      return response.data
    } catch (error) {
      logger.error('AssetService', 'Failed to create asset', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Update asset
   */
  async update(id: number, data: UpdateAssetData): Promise<Asset> {
    try {
      logger.info(
        'AssetService',
        `Updating asset ID: ${id}`,
        data as Record<string, unknown>
      )
      const response = await api.put<Asset>(`/assets/${id}`, data)
      logger.success(
        'AssetService',
        `Updated asset: ${response.data.namaBarang}`
      )
      return response.data
    } catch (error) {
      logger.error('AssetService', `Failed to update asset ID: ${id}`, error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Delete asset (soft delete)
   */
  async delete(id: number): Promise<void> {
    try {
      logger.info('AssetService', `Deleting asset ID: ${id}`)
      await api.delete(`/assets/${id}`)
      logger.success('AssetService', `Deleted asset ID: ${id}`)
    } catch (error) {
      logger.error('AssetService', `Failed to delete asset ID: ${id}`, error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Upload asset photo
   */
  async uploadPhoto(id: number, file: File): Promise<Asset> {
    try {
      logger.info('AssetService', `Uploading photo for asset ID: ${id}`)
      const formData = new FormData()
      formData.append('photo', file)

      const response = await api.put<Asset>(`/assets/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      logger.success(
        'AssetService',
        `Uploaded photo for asset: ${response.data.namaBarang}`
      )
      return response.data
    } catch (error) {
      logger.error(
        'AssetService',
        `Failed to upload photo for asset ID: ${id}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get asset QR code
   */
  async getQrCode(id: number): Promise<string> {
    try {
      logger.info('AssetService', `Fetching QR code for asset ID: ${id}`)
      const response = await api.get<{ qrCode: string }>(
        `/assets/${id}/qr-code`
      )
      logger.success('AssetService', `Fetched QR code for asset ID: ${id}`)
      return response.data.qrCode
    } catch (error) {
      logger.error(
        'AssetService',
        `Failed to fetch QR code for asset ID: ${id}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get asset mutation history
   */
  async getMutations(assetId: number): Promise<AssetMutation[]> {
    try {
      logger.info('AssetService', `Fetching mutations for asset ID: ${assetId}`)
      const response = await api.get<AssetMutation[]>(
        `/assets/${assetId}/mutations`
      )
      const data = Array.isArray(response.data) ? response.data : []
      logger.success('AssetService', `Fetched ${data.length} mutations`)
      return data
    } catch (error) {
      logger.error(
        'AssetService',
        `Failed to fetch mutations for asset ID: ${assetId}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }
}

// Export singleton instance
export const assetService: IAssetService = new HttpAssetService()
