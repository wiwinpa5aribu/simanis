import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaClient } from '@simanis/database'
import { UpdateCategoryUsefulLifeUseCase } from './update-category-useful-life.use-case'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { ValidationError } from '../../../shared/errors/validation-error'

describe('UpdateCategoryUsefulLifeUseCase', () => {
  let prisma: PrismaClient
  let useCase: UpdateCategoryUsefulLifeUseCase

  beforeEach(() => {
    prisma = {
      assetCategory: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    } as any
    useCase = new UpdateCategoryUsefulLifeUseCase(prisma)
  })

  describe('execute', () => {
    it('should update category useful life successfully', async () => {
      const categoryId = 1
      const defaultMasaManfaat = 5

      const existingCategory = {
        id: categoryId,
        name: 'Elektronik',
        defaultMasaManfaat: 4,
      }

      const updatedCategory = {
        id: categoryId,
        name: 'Elektronik',
        defaultMasaManfaat: 5,
      }

      vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue(existingCategory as any)
      vi.mocked(prisma.assetCategory.update).mockResolvedValue(updatedCategory as any)

      const result = await useCase.execute({ categoryId, defaultMasaManfaat })

      expect(result).toEqual({
        id: categoryId,
        name: 'Elektronik',
        defaultMasaManfaat: 5,
      })
      expect(prisma.assetCategory.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      })
      expect(prisma.assetCategory.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: { defaultMasaManfaat: 5 },
      })
    })

    it('should throw ValidationError if masa manfaat < 1', async () => {
      await expect(
        useCase.execute({ categoryId: 1, defaultMasaManfaat: 0 })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ categoryId: 1, defaultMasaManfaat: -5 })
      ).rejects.toThrow('Masa manfaat harus antara 1-20 tahun')
    })

    it('should throw ValidationError if masa manfaat > 20', async () => {
      await expect(
        useCase.execute({ categoryId: 1, defaultMasaManfaat: 21 })
      ).rejects.toThrow(ValidationError)

      await expect(
        useCase.execute({ categoryId: 1, defaultMasaManfaat: 100 })
      ).rejects.toThrow('Masa manfaat harus antara 1-20 tahun')
    })

    it('should throw NotFoundError if category does not exist', async () => {
      vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue(null)

      await expect(
        useCase.execute({ categoryId: 999, defaultMasaManfaat: 5 })
      ).rejects.toThrow(NotFoundError)

      await expect(
        useCase.execute({ categoryId: 999, defaultMasaManfaat: 5 })
      ).rejects.toThrow('Kategori dengan ID 999 tidak ditemukan')
    })

    it('should accept valid masa manfaat values (1-20)', async () => {
      const category = { id: 1, name: 'Test', defaultMasaManfaat: 4 }

      vi.mocked(prisma.assetCategory.findUnique).mockResolvedValue(category as any)
      vi.mocked(prisma.assetCategory.update).mockResolvedValue({
        ...category,
        defaultMasaManfaat: 1,
      } as any)

      // Test boundary values
      await expect(
        useCase.execute({ categoryId: 1, defaultMasaManfaat: 1 })
      ).resolves.toBeTruthy()

      vi.mocked(prisma.assetCategory.update).mockResolvedValue({
        ...category,
        defaultMasaManfaat: 20,
      } as any)

      await expect(
        useCase.execute({ categoryId: 1, defaultMasaManfaat: 20 })
      ).resolves.toBeTruthy()
    })
  })
})
