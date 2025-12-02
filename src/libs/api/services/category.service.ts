/**
 * Category Service - HTTP Adapter
 * Service layer untuk operasi kategori aset menggunakan HTTP/REST API
 */

import { api } from '../client'
import { logger } from '../../utils/logger'
import { getErrorMessage } from '../../utils/errorHandling'
import { ERROR_MESSAGES } from '../../../constants'
import type {
  ICategoryService,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from './types'

class HttpCategoryService implements ICategoryService {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    try {
      logger.info('CategoryService', 'Fetching categories')
      const response = await api.get<Category[]>('/categories')
      const data = Array.isArray(response.data) ? response.data : []
      logger.success('CategoryService', `Fetched ${data.length} categories`)
      return data
    } catch (error) {
      logger.error('CategoryService', 'Failed to fetch categories', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<Category> {
    try {
      logger.info('CategoryService', `Fetching category ID: ${id}`)
      const response = await api.get<Category>(`/categories/${id}`)
      logger.success(
        'CategoryService',
        `Fetched category: ${response.data.name}`
      )
      return response.data
    } catch (error) {
      logger.error(
        'CategoryService',
        `Failed to fetch category ID: ${id}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
    }
  }

  /**
   * Create new category
   */
  async create(data: CreateCategoryData): Promise<Category> {
    try {
      logger.info('CategoryService', 'Creating category', { name: data.name })
      const response = await api.post<Category>('/categories', data)
      logger.success(
        'CategoryService',
        `Created category: ${response.data.name}`
      )
      return response.data
    } catch (error) {
      logger.error('CategoryService', 'Failed to create category', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Update category
   */
  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    try {
      logger.info(
        'CategoryService',
        `Updating category ID: ${id}`,
        data as Record<string, unknown>
      )
      const response = await api.put<Category>(`/categories/${id}`, data)
      logger.success(
        'CategoryService',
        `Updated category: ${response.data.name}`
      )
      return response.data
    } catch (error) {
      logger.error(
        'CategoryService',
        `Failed to update category ID: ${id}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Delete category
   */
  async delete(id: number): Promise<void> {
    try {
      logger.info('CategoryService', `Deleting category ID: ${id}`)
      await api.delete(`/categories/${id}`)
      logger.success('CategoryService', `Deleted category ID: ${id}`)
    } catch (error) {
      logger.error(
        'CategoryService',
        `Failed to delete category ID: ${id}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }
}

// Export singleton instance
export const categoryService: ICategoryService = new HttpCategoryService()
