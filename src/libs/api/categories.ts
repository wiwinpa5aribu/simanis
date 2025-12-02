/**
 * Categories API - Menangani operasi CRUD untuk kategori aset
 * Disesuaikan dengan Prisma Schema (camelCase)
 */

import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertNonEmptyString, isDefined } from '../utils/guards'
import { logger } from '../utils/logger'
import type {
  Category,
  CategoryFormValues,
} from '../validation/categorySchemas'
import { api } from './client'

/**
 * Get Categories - Mengambil semua daftar kategori
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    logger.info('Categories API', 'Mengambil daftar kategori')

    const response = await api.get<Category[]>('/categories')

    logger.success(
      'Categories API',
      `Berhasil mengambil ${response.data.length} kategori`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Categories API', 'Gagal mengambil daftar kategori', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Category By ID - Mengambil detail kategori berdasarkan ID
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    logger.info('Categories API', `Mengambil kategori dengan ID: ${id}`)

    const response = await api.get<Category>(`/categories/${id}`)

    if (!isDefined(response.data)) {
      throw new Error('Kategori tidak ditemukan')
    }

    logger.success(
      'Categories API',
      `Berhasil mengambil kategori: ${response.data.name}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Categories API',
      `Gagal mengambil kategori dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}

/**
 * Create Category - Membuat kategori baru
 */
export const createCategory = async (
  data: CategoryFormValues
): Promise<Category> => {
  try {
    if (!isDefined(data)) {
      throw new Error('Data kategori harus diisi')
    }
    assertNonEmptyString(data.name, 'createCategory', 'Nama kategori')

    logger.info('Categories API', 'Membuat kategori baru', { name: data.name })

    const response = await api.post<Category>('/categories', data)

    if (!isDefined(response.data)) {
      throw new Error('Gagal membuat kategori: response kosong')
    }

    logger.success(
      'Categories API',
      `Berhasil membuat kategori: ${response.data.name}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Categories API', 'Gagal membuat kategori', error, {
      categoryName: data.name,
    })
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Update Category - Mengupdate data kategori
 */
export const updateCategory = async (
  id: number,
  data: CategoryFormValues
): Promise<Category> => {
  try {
    logger.info('Categories API', `Mengupdate kategori dengan ID: ${id}`, {
      name: data.name,
    })

    const response = await api.put<Category>(`/categories/${id}`, data)

    logger.success(
      'Categories API',
      `Berhasil mengupdate kategori: ${response.data.name}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Categories API',
      `Gagal mengupdate kategori dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Delete Category - Menghapus kategori
 */
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    logger.info('Categories API', `Menghapus kategori dengan ID: ${id}`)
    await api.delete(`/categories/${id}`)
    logger.success(
      'Categories API',
      `Berhasil menghapus kategori dengan ID: ${id}`
    )
  } catch (error: unknown) {
    logger.error(
      'Categories API',
      `Gagal menghapus kategori dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
