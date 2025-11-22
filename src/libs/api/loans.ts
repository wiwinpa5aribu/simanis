/**
 * Loans API - Menangani operasi peminjaman aset
 * Fungsi-fungsi untuk mengambil, membuat, dan mengembalikan peminjaman
 */

import { api } from './client'
import type { LoanFormValues, Loan } from '../validation/loanSchemas'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES } from '../../constants'
import { getErrorMessage } from '../utils/errorHandling'
import { assertNonEmptyString, assertValidId, isDefined } from '../utils/guards'

/**
 * Get Loans - Mengambil daftar semua peminjaman
 * @returns Array of loans
 * @throws Error jika gagal mengambil data
 */
export const getLoans = async (): Promise<Loan[]> => {
  try {
    logger.info('Loans API', 'Mengambil daftar peminjaman')

    const response = await api.get<Loan[]>('/loans')

    logger.success(
      'Loans API',
      `Berhasil mengambil ${response.data.length} peminjaman`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Loans API', 'Gagal mengambil daftar peminjaman', error)
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}

/**
 * Create Loan - Membuat peminjaman baru
 * @param data - Data peminjaman baru
 * @returns Loan yang baru dibuat
 * @throws Error jika gagal membuat peminjaman
 */
export const createLoan = async (data: LoanFormValues): Promise<Loan> => {
  try {
    // Defensive: Validasi data input
    if (!isDefined(data)) {
      logger.error('createLoan', 'Data is null or undefined')
      throw new Error('Data peminjaman harus diisi')
    }

    assertValidId(data.asset_id, 'createLoan', 'Asset ID')
    assertNonEmptyString(data.borrower_name, 'createLoan', 'Nama peminjam')

    logger.info('Loans API', 'Membuat peminjaman baru', {
      assetId: data.asset_id,
      borrower: data.borrower_name,
    })

    const response = await api.post<Loan>('/loans', data)

    // Defensive: Validasi response
    if (!isDefined(response.data)) {
      logger.error('Loans API', 'Empty response after create')
      throw new Error('Gagal membuat peminjaman: response kosong')
    }

    logger.success(
      'Loans API',
      `Berhasil membuat peminjaman untuk: ${data.borrower_name}`
    )

    return response.data
  } catch (error: unknown) {
    logger.error('Loans API', 'Gagal membuat peminjaman', error, {
      assetId: data.asset_id,
      borrower: data.borrower_name,
    })
    throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
  }
}

/**
 * Return Loan - Mengembalikan aset yang dipinjam
 * @param id - ID peminjaman
 * @param returnDate - Tanggal pengembalian
 * @returns Loan yang sudah diupdate
 * @throws Error jika gagal mengembalikan
 */
export const returnLoan = async (
  id: number,
  returnDate: string
): Promise<Loan> => {
  try {
    logger.info('Loans API', `Mengembalikan peminjaman dengan ID: ${id}`, {
      returnDate,
    })

    const response = await api.put<Loan>(`/loans/${id}/return`, {
      return_date: returnDate,
    })

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
