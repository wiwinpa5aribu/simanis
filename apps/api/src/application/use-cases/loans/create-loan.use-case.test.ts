import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ILoanRepository } from '../../../domain/repositories/loan.repository'
import type { LoanDto } from '../../dto/loan.dto'
import type { CreateLoanInput } from '../../validators/loan.validators'
import { CreateLoanUseCase } from './create-loan.use-case'

vi.mock('../../../shared/logger/winston.logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('CreateLoanUseCase', () => {
  let createLoanUseCase: CreateLoanUseCase
  let mockLoanRepository: ILoanRepository

  const mockLoanDto: LoanDto = {
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

    createLoanUseCase = new CreateLoanUseCase(mockLoanRepository)
  })

  describe('Successful Loan Creation', () => {
    it('should create loan and return with relations', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-01-15',
        keterangan: 'Untuk kegiatan lab',
        requestedBy: 1,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-01-15'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: 'Untuk kegiatan lab',
        requestedBy: 1,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue(mockLoanDto)

      // Act
      const result = await createLoanUseCase.execute(input)

      // Assert
      expect(result).toEqual(mockLoanDto)
      expect(mockLoanRepository.create).toHaveBeenCalledWith({
        ...input,
        tanggalPinjam: new Date('2024-01-15'),
      })
      expect(mockLoanRepository.findById).toHaveBeenCalledWith(1)
    })

    it('should handle multiple items', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-01-15',
        keterangan: 'Untuk kegiatan lab',
        requestedBy: 1,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
          {
            assetId: 2,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
          {
            assetId: 3,
            kondisiAwal: 'Rusak Ringan',
            keterangan: 'Sudah ada goresan',
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-01-15'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: 'Untuk kegiatan lab',
        requestedBy: 1,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      }

      const loanWithMultipleItems: LoanDto = {
        ...mockLoanDto,
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
          {
            id: 2,
            loanId: 1,
            assetId: 2,
            kondisiAwal: 'Baik',
            kondisiAkhir: null,
            keterangan: null,
            tanggalKembali: null,
            asset: {
              id: 2,
              kodeAset: 'SCH/24/ELK/002',
              namaBarang: 'Laptop HP',
            },
          },
          {
            id: 3,
            loanId: 1,
            assetId: 3,
            kondisiAwal: 'Rusak Ringan',
            kondisiAkhir: null,
            keterangan: 'Sudah ada goresan',
            tanggalKembali: null,
            asset: {
              id: 3,
              kodeAset: 'SCH/24/ELK/003',
              namaBarang: 'Projector',
            },
          },
        ],
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue(
        loanWithMultipleItems
      )

      // Act
      const result = await createLoanUseCase.execute(input)

      // Assert
      expect(result.items).toHaveLength(3)
      expect(mockLoanRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          items: input.items,
        })
      )
    })

    it('should handle different date formats', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-12-25T10:30:00.000Z',
        keterangan: 'Test',
        requestedBy: 1,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-12-25T10:30:00.000Z'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: 'Test',
        requestedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue(mockLoanDto)

      // Act
      await createLoanUseCase.execute(input)

      // Assert
      expect(mockLoanRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tanggalPinjam: new Date('2024-12-25T10:30:00.000Z'),
        })
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle single item loan', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-01-15',
        keterangan: 'Single item',
        requestedBy: 1,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-01-15'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: 'Single item',
        requestedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue(mockLoanDto)

      // Act
      const result = await createLoanUseCase.execute(input)

      // Assert
      expect(result.items).toHaveLength(1)
    })

    it('should handle loan without keterangan', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-01-15',
        keterangan: null,
        requestedBy: 1,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-01-15'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: null,
        requestedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const loanDtoWithoutKeterangan: LoanDto = {
        ...mockLoanDto,
        keterangan: null,
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue(
        loanDtoWithoutKeterangan
      )

      // Act
      const result = await createLoanUseCase.execute(input)

      // Assert
      expect(result.keterangan).toBeNull()
    })

    it('should handle different kondisi values', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-01-15',
        keterangan: 'Test kondisi',
        requestedBy: 1,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
          {
            assetId: 2,
            kondisiAwal: 'Rusak Ringan',
            keterangan: 'Ada beberapa lecet',
          },
          {
            assetId: 3,
            kondisiAwal: 'Rusak Berat',
            keterangan: 'Perlu perbaikan',
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-01-15'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: 'Test kondisi',
        requestedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue(mockLoanDto)

      // Act
      await createLoanUseCase.execute(input)

      // Assert
      expect(mockLoanRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ kondisiAwal: 'Baik' }),
            expect.objectContaining({ kondisiAwal: 'Rusak Ringan' }),
            expect.objectContaining({ kondisiAwal: 'Rusak Berat' }),
          ]),
        })
      )
    })

    it('should handle different user IDs', async () => {
      // Arrange
      const input: CreateLoanInput = {
        tanggalPinjam: '2024-01-15',
        keterangan: 'Test user',
        requestedBy: 99,
        items: [
          {
            assetId: 1,
            kondisiAwal: 'Baik',
            keterangan: null,
          },
        ],
      }

      const createdLoan = {
        id: 1,
        nomorPeminjaman: 'LOAN/24/001',
        tanggalPinjam: new Date('2024-01-15'),
        tanggalKembali: null,
        status: 'DIPINJAM',
        keterangan: 'Test user',
        requestedBy: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(mockLoanRepository.create).mockResolvedValue(createdLoan)
      vi.mocked(mockLoanRepository.findById).mockResolvedValue({
        ...mockLoanDto,
        requestedBy: 99,
        user: {
          id: 99,
          name: 'Another User',
          username: 'anotheruser',
        },
      })

      // Act
      const result = await createLoanUseCase.execute(input)

      // Assert
      expect(result.requestedBy).toBe(99)
      expect(result.user.id).toBe(99)
    })
  })
})
