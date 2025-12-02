/**
 * Loan Service - HTTP Adapter
 * Service layer untuk operasi peminjaman menggunakan HTTP/REST API
 */

import { ERROR_MESSAGES } from '../../../constants'
import { getErrorMessage } from '../../utils/errorHandling'
import { logger } from '../../utils/logger'
import { api } from '../client'
import type {
  CreateLoanData,
  ILoanService,
  Loan,
  LoanDetail,
  LoanFilters,
  PaginatedResponse,
  ReturnLoanData,
} from './types'

class HttpLoanService implements ILoanService {
  /**
   * Get all loans with pagination and filters
   */
  async getAll(filters?: LoanFilters): Promise<PaginatedResponse<Loan>> {
    try {
      logger.info(
        'LoanService',
        'Fetching loans',
        filters as Record<string, unknown>
      )

      const response = await api.get<Loan[]>('/loans', { params: filters })
      const data = Array.isArray(response.data) ? response.data : []
      const meta = (
        response as unknown as { meta?: PaginatedResponse<Loan>['meta'] }
      ).meta

      logger.success('LoanService', `Fetched ${data.length} loans`)

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
      logger.error('LoanService', 'Failed to fetch loans', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get loan by ID with full details
   */
  async getById(id: number): Promise<LoanDetail> {
    try {
      logger.info('LoanService', `Fetching loan ID: ${id}`)
      const response = await api.get<LoanDetail>(`/loans/${id}`)
      logger.success('LoanService', `Fetched loan ID: ${id}`)
      return response.data
    } catch (error) {
      logger.error('LoanService', `Failed to fetch loan ID: ${id}`, error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.NOT_FOUND)
    }
  }

  /**
   * Create new loan
   */
  async create(data: CreateLoanData): Promise<Loan> {
    try {
      logger.info('LoanService', 'Creating loan', {
        itemCount: data.items.length,
      })
      const response = await api.post<Loan>('/loans', data)
      logger.success('LoanService', `Created loan ID: ${response.data.id}`)
      return response.data
    } catch (error) {
      logger.error('LoanService', 'Failed to create loan', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Return loan (pengembalian)
   */
  async return(id: number, data: ReturnLoanData): Promise<Loan> {
    try {
      logger.info('LoanService', `Returning loan ID: ${id}`, {
        itemCount: data.items.length,
      })
      const response = await api.put<Loan>(`/loans/${id}/return`, data)
      logger.success('LoanService', `Returned loan ID: ${id}`)
      return response.data
    } catch (error) {
      logger.error('LoanService', `Failed to return loan ID: ${id}`, error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }
}

// Export singleton instance
export const loanService: ILoanService = new HttpLoanService()
