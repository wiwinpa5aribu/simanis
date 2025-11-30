/**
 * Loans API - Menangani operasi peminjaman aset
 * Disesuaikan dengan Prisma Schema (camelCase, multiple items per loan)
 */

import { api } from './client'
import type {
  Loan,
  LoanDetail,
  CreateLoanFormValues,
  ReturnLoanFormValues,
  LoanFilterValues,
} from '../validation/loanSchemas'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertValidId, isDefined } from '../utils/guards'

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * Get Loans - Mengambil daftar peminjaman dengan pagination dan filter
 */
export const getLoans = async (
  filters?: Partial<LoanFilterValues>
): Promise<PaginatedResponse<Loan>> => {
  try {
    logger.info('Loans API', 'Mengambil daftar peminjaman', filters)

    const response = await api.get<Loan[]>('/loans', { params: filters })

    const data = Array.isArray(response.data) ? response.data : []
    const meta = (
      response as unknown as { meta?: PaginatedResponse<Loan>['meta'] }
    ).meta

    logger.success('Loans API', `Berhasil mengambil ${data.length} peminjaman`)

    return {
      data,
      meta: meta || {
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 10,
        total: data.length,
        totalPages: 1,
      },
    }
  } catch (error: unknown) {
    logger.error('Loans API', 'Gagal mengambil daftar peminjaman', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Loan By ID - Mengambil detail peminjaman berdasarkan ID
 */
export const getLoanById = async (id: number): Promise<LoanDetail> => {
  try {
    assertValidId(id, 'getLoanById', 'Loan ID')
    logger.info('Loans API', `Mengambil detail peminjaman dengan ID: ${id}`)

    const response = await api.get<LoanDetail>(`/loans/${id}`)

    if (!isDefined(response.data)) {
      throw new Error('Peminjaman tidak ditemukan')
    }

    logger.success(
      'Loans API',
      `Berhasil mengambil detail peminjaman ID: ${id}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Loans API',
      `Gagal mengambil peminjaman dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
  }
}

/**
 * Create Loan - Membuat peminjaman baru (multiple items)
 */
export const createLoan = async (data: CreateLoanFormValues): Promise<Loan> => {
  try {
    if (!isDefined(data)) {
      throw new Error('Data peminjaman harus diisi')
    }
    if (!data.items || data.items.length === 0) {
      throw new Error('Minimal 1 aset harus dipinjam')
    }

    logger.info('Loans API', 'Membuat peminjaman baru', {
      itemCount: data.items.length,
      tanggalPinjam: data.tanggalPinjam,
    })

    const response = await api.post<Loan>('/loans', data)

    if (!isDefined(response.data)) {
      throw new Error('Gagal membuat peminjaman: response kosong')
    }

    logger.success(
      'Loans API',
      `Berhasil membuat peminjaman ID: ${response.data.id}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error('Loans API', 'Gagal membuat peminjaman', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Return Loan - Mengembalikan aset yang dipinjam
 */
export const returnLoan = async (
  id: number,
  data: ReturnLoanFormValues
): Promise<Loan> => {
  try {
    assertValidId(id, 'returnLoan', 'Loan ID')
    logger.info('Loans API', `Mengembalikan peminjaman dengan ID: ${id}`, {
      itemCount: data.items.length,
    })

    const response = await api.put<Loan>(`/loans/${id}/return`, data)

    logger.success(
      'Loans API',
      `Berhasil mengembalikan peminjaman dengan ID: ${id}`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Loans API',
      `Gagal mengembalikan peminjaman dengan ID: ${id}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Loans By Asset - Mengambil riwayat peminjaman per aset
 */
export const getLoansByAsset = async (assetId: number): Promise<Loan[]> => {
  try {
    assertValidId(assetId, 'getLoansByAsset', 'Asset ID')
    logger.info(
      'Loans API',
      `Mengambil riwayat peminjaman untuk aset ID: ${assetId}`
    )

    const response = await api.get<Loan[]>(`/loans/by-asset/${assetId}`)

    logger.success(
      'Loans API',
      `Berhasil mengambil ${response.data.length} peminjaman`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Loans API',
      `Gagal mengambil peminjaman untuk aset ID: ${assetId}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Get Loans By User - Mengambil riwayat peminjaman per user
 */
export const getLoansByUser = async (userId: number): Promise<Loan[]> => {
  try {
    assertValidId(userId, 'getLoansByUser', 'User ID')
    logger.info(
      'Loans API',
      `Mengambil riwayat peminjaman untuk user ID: ${userId}`
    )

    const response = await api.get<Loan[]>(`/loans/by-user/${userId}`)

    logger.success(
      'Loans API',
      `Berhasil mengambil ${response.data.length} peminjaman`
    )
    return response.data
  } catch (error: unknown) {
    logger.error(
      'Loans API',
      `Gagal mengambil peminjaman untuk user ID: ${userId}`,
      error
    )
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}
