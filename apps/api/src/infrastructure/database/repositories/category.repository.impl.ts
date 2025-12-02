import { PrismaClient } from '@simanis/database'
import { IAssetCategoryRepository } from '../../../domain/repositories/category.repository'

export class AssetCategoryRepositoryImpl implements IAssetCategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.assetCategory.findMany({
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: number) {
    return this.prisma.assetCategory.findUnique({
      where: { id },
    })
  }

  async findByName(name: string) {
    return this.prisma.assetCategory.findUnique({
      where: { name },
    })
  }

  async create(data: { name: string; description?: string }) {
    return this.prisma.assetCategory.create({
      data,
    })
  }

  async update(id: number, data: { name?: string; description?: string }) {
    return this.prisma.assetCategory.update({
      where: { id },
      data,
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.assetCategory.delete({
      where: { id },
    })
  }
}
