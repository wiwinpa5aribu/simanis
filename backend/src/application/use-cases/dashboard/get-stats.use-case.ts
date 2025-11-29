import { PrismaClient } from '@prisma/client';

export interface DashboardStats {
  total_assets: number;
  total_value: number;
  active_loans: number;
  assets_by_condition: {
    Baik: number;
    'Rusak Ringan': number;
    'Rusak Berat': number;
    Hilang: number;
  };
  assets_by_category: {
    category_name: string;
    count: number;
  }[];
}

export class GetStatsUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(): Promise<DashboardStats> {
    const [totalAssets, totalValueResult, activeLoans, assetsByCondition, assetsByCategory] =
      await Promise.all([
        // Total assets
        this.prisma.asset.count({ where: { isDeleted: false } }),

        // Total asset value
        this.prisma.asset.aggregate({
          _sum: { harga: true },
          where: { isDeleted: false },
        }),

        // Active loans
        this.prisma.loan.count({
          where: { status: 'DIPINJAM' },
        }),

        // Assets by condition
        this.prisma.asset.groupBy({
          by: ['kondisi'],
          _count: { id: true },
          where: { isDeleted: false },
        }),

        // Assets by category
        this.prisma.asset.groupBy({
          by: ['categoryId'],
          _count: { id: true },
          where: { isDeleted: false },
        }),
      ]);

    // Get category names
    const categoryIds = assetsByCategory
      .map((item) => item.categoryId)
      .filter((id): id is number => id !== null);

    const categories = await this.prisma.assetCategory.findMany({
      where: { id: { in: categoryIds } },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    // Build condition map with defaults
    const conditionMap: Record<string, number> = {
      Baik: 0,
      'Rusak Ringan': 0,
      'Rusak Berat': 0,
      Hilang: 0,
    };
    assetsByCondition.forEach((item) => {
      conditionMap[item.kondisi] = item._count.id;
    });

    // Build category array
    const categoryArray = assetsByCategory
      .map((item) => ({
        category_name: item.categoryId
          ? categoryMap.get(item.categoryId) || 'Lainnya'
          : 'Tanpa Kategori',
        count: item._count.id,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    // Format response sesuai frontend interface
    return {
      total_assets: totalAssets,
      total_value: Number(totalValueResult._sum.harga || 0),
      active_loans: activeLoans,
      assets_by_condition: {
        Baik: conditionMap['Baik'],
        'Rusak Ringan': conditionMap['Rusak Ringan'],
        'Rusak Berat': conditionMap['Rusak Berat'],
        Hilang: conditionMap['Hilang'],
      },
      assets_by_category: categoryArray,
    };
  }
}
