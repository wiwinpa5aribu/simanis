import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ILoanRepository } from '../../../domain/repositories/loan.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import type { LoanDto } from '../../dto/loan.dto'
import type { ReturnLoanInput } from '../../validators/loan.validators'
import { ReturnLoanUseCase } from './return-loan.use-case'

vi.mock('../../../shared/logger/winston.logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ReturnLoanUseCase', () => {
  let returnLoanUseCase: ReturnLoanUseCase
  let mockLoanRepository: ILoanRepository

  const mockActiveLoan: LoanDto = {
    id: 1,
    nomorPeminjaman: 'LOAN/24/001',
    tanggalPinjam: new Date('2024-01-15'),
    tanggalKembali: null,
    status: 'DIPINJAM',
    keterangan: 'Untuk kegiatan lab',
    requestedBy: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    user: {
      id: 1,
      name: 'Test User',
      username: 'testuser',
    },
    items: [
      {
        id: 1,
        loanId: 1,
        assetId: 1,
        kondisiAwal: 'Baik',
        kondisiAkhir: null,
        keterangan: null,
        tanggalKembali: null,
        asset: {
          id: 1,
          kodeAset: 'SCH/24/ELK/001',
          namaBarang: 'Laptop Dell',
        },
      },
    ],
  }

  const mockReturnedLoan: LoanDto = {
    ...mockActiveLoan,
    tanggalKembali: new Date('2024-01-20'),
    status: 'DIKEMBALIKAN',
    items: [
      {
        ...mockActiveLoan.items[0],
        kondisiAkhir: 'Baik',
        tanggalKembali: new Date('2024-01-20'),
        keterangan: null,
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockLoanRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      returnLoan: vi.fn(),
      getActiveLoans: vi.fn(),
      getOverdueLoans: vi.fn(),
    }

    returnLoanUseCase = new ReturnLoanUseCase(mockLoanRepository)
  })

  describe('Successful Return', () => {
    it('should return loan and update status', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById)
        .mockResolvedValueOnce(mockActiveLoan)
        .mockResolvedValueOnce(mockReturnedLoan)
      vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

      // Act
      const result = await returnLoanUseCase.execute(loanId, input)

      // Assert
      expect(result).toEqual(mockReturnedLoan)
      expect(mockLoanRepository.findById).toHaveBeenCalledTimes(2)
      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(
        loanId,
        input.items
      )
    })

    it('should handle multiple items return', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
          {
            loanItemId: 2,
            kondisiAkhir: 'Rusak Ringan',
            keterangan: 'Ada goresan baru',
          },
          {
            loanItemId: 3,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      const loanWithMultipleItems: LoanDto = {
        ...mockActiveLoan,
        items: [
          { ...mockActiveLoan.items[0], id: 1 },
          { ...mockActiveLoan.items[0], id: 2, assetId: 2 },
          { ...mockActiveLoan.items[0], id: 3, assetId: 3 },
        ],
      }

      vi.mocked(mockLoanRepository.findById)
        .mockResolvedValueOnce(loanWithMultipleItems)
        .mockResolvedValueOnce(mockReturnedLoan)
      vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

      // Act
      const result = await returnLoanUseCase.execute(loanId, input)

      // Assert
      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(
        loanId,
        input.items
      )
      expect(result).toBeDefined()
    })

    it('should handle items with different kondisiAkhir', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
          {
            loanItemId: 2,
            kondisiAkhir: 'Rusak Ringan',
            keterangan: 'Layar retak',
          },
          {
            loanItemId: 3,
            kondisiAkhir: 'Rusak Berat',
            keterangan: 'Tidak bisa menyala',
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById)
        .mockResolvedValueOnce(mockActiveLoan)
        .mockResolvedValueOnce(mockReturnedLoan)
      vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

      // Act
      await returnLoanUseCase.execute(loanId, input)

      // Assert
      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(loanId, [
        { loanItemId: 1, kondisiAkhir: 'Baik', keterangan: null },
        {
          loanItemId: 2,
          kondisiAkhir: 'Rusak Ringan',
          keterangan: 'Layar retak',
        },
        {
          loanItemId: 3,
          kondisiAkhir: 'Rusak Berat',
          keterangan: 'Tidak bisa menyala',
        },
      ])
    })
  })

  describe('Loan Not Found', () => {
    it('should throw NotFoundError when loan does not exist', async () => {
      // Arrange
      const loanId = 999
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(returnLoanUseCase.execute(loanId, input)).rejects.toThrow(
        NotFoundError
      )

      await expect(returnLoanUseCase.execute(loanId, input)).rejects.toThrow(
        'Peminjaman tidak ditemukan'
      )

      expect(mockLoanRepository.returnLoan).not.toHaveBeenCalled()
    })

    it('should throw NotFoundError for invalid loan ID', async () => {
      // Arrange
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(returnLoanUseCase.execute(0, input)).rejects.toThrow(
        NotFoundError
      )
      await expect(returnLoanUseCase.execute(-1, input)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle single item return', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById)
        .mockResolvedValueOnce(mockActiveLoan)
        .mockResolvedValueOnce(mockReturnedLoan)
      vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

      // Act
      const result = await returnLoanUseCase.execute(loanId, input)

      // Assert
      expect(result.items).toHaveLength(1)
    })

    it('should handle items without keterangan', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
          {
            loanItemId: 2,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById)
        .mockResolvedValueOnce(mockActiveLoan)
        .mockResolvedValueOnce(mockReturnedLoan)
      vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

      // Act
      await returnLoanUseCase.execute(loanId, input)

      // Assert
      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(
        loanId,
        expect.arrayContaining([
          expect.objectContaining({ keterangan: null }),
          expect.objectContaining({ keterangan: null }),
        ])
      )
    })

    it('should handle items with detailed keterangan', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Rusak Ringan',
            keterangan:
              'Layar ada goresan kecil di pojok kanan atas, fungsi normal',
          },
        ],
      }

      vi.mocked(mockLoanRepository.findById)
        .mockResolvedValueOnce(mockActiveLoan)
        .mockResolvedValueOnce(mockReturnedLoan)
      vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

      // Act
      await returnLoanUseCase.execute(loanId, input)

      // Assert
      expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(
        loanId,
        expect.arrayContaining([
          expect.objectContaining({
            keterangan:
              'Layar ada goresan kecil di pojok kanan atas, fungsi normal',
          }),
        ])
      )
    })

    it('should verify call order is correct', async () => {
      // Arrange
      const loanId = 1
      const input: ReturnLoanInput = {
        items: [
          {
            loanItemId: 1,
            kondisiAkhir: 'Baik',
            keterangan: null,
          },
        ],
      }

      const callOrder: string[] = []

      vi.mocked(mockLoanRepository.findById).mockImplementation(async () => {
        callOrder.push('findById')
        return callOrder.length === 1 ? mockActiveLoan : mockReturnedLoan
      })

      vi.mocked(mockLoanRepository.returnLoan).mockImplementation(async () => {
        callOrder.push('returnLoan')
      })

      // Act
      await returnLoanUseCase.execute(loanId, input)

      // Assert - Verify correct order: check loan exists, return loan, get updated loan
      expect(callOrder).toEqual(['findById', 'returnLoan', 'findById'])
    })

    it('should handle loans with different IDs', async () => {
      // Arrange
      const testCases = [1, 10, 100, 9999]

      for (const loanId of testCases) {
        vi.clearAllMocks()

        const input: ReturnLoanInput = {
          items: [
            {
              loanItemId: 1,
              kondisiAkhir: 'Baik',
              keterangan: null,
            },
          ],
        }

        vi.mocked(mockLoanRepository.findById)
          .mockResolvedValueOnce({ ...mockActiveLoan, id: loanId })
          .mockResolvedValueOnce({ ...mockReturnedLoan, id: loanId })
        vi.mocked(mockLoanRepository.returnLoan).mockResolvedValue(undefined)

        // Act
        await returnLoanUseCase.execute(loanId, input)

        // Assert
        expect(mockLoanRepository.findById).toHaveBeenCalledWith(loanId)
        expect(mockLoanRepository.returnLoan).toHaveBeenCalledWith(
          loanId,
          input.items
        )
      }
    })
  })
})
