/**
 * Categories API - Menangani operasi CRUD untuk kategori aset
 * Fungsi-fungsi untuk mengambil, membuat, mengupdate, dan menghapus kategori
 */

import { api } from './client'
import type {
  CategoryFormValues,
  Category,
} from '../validation/categorySchemas'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertNonEmptyString, isDefined } from '../utils/guards'

/**
 * Get Categories - Mengambil semua daftar kategori
 * @returns Array of categories
 * @throws Error jika gagal mengambil data
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
 * Create Category - Membuat kategori baru
 * @param data - Data kategori baru
 * @returns Category yang baru dibuat
 * @throws Error jika gagal membuat kategori
 */
export const createCategory = async (
  data: CategoryFormValues
): Promise<Category> => {
  try {
    // Defensive: Validasi data input
    if (!isDefined(data)) {
      logger.error('createCategory', 'Data is null or undefined')
      throw new Error('Data kategori harus diisi')
    }

    assertNonEmptyString(data.name, 'createCategory', 'Nama kategori')

    logger.info('Categories API', 'Membuat kategori baru', { name: data.name })

    const response = await api.post<Category>('/categories', data)

    // Defensive: Validasi response
    if (!isDefined(response.data)) {
      logger.error('Categories API', 'Empty response after create')
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
 * @param id - ID kategori yang akan diupdate
 * @param data - Data kategori yang baru
 * @returns Category yang sudah diupdate
 * @throws Error jika gagal mengupdate
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
 * @param id - ID kategori yang akan dihapus
 * @throws Error jika gagal menghapus
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
