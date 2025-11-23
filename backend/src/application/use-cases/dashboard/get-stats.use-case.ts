import { PrismaClient } from '@prisma/client';

export interface DashboardStats {
    totalAssets: number;
    totalValue: number;
    activeLoans: number;
    assetsByCondition: Record<string, number>;
    assetsByCategory: Record<string, number>;
}

export class GetStatsUseCase {
    constructor(private prisma: PrismaClient) { }

    async execute(): Promise<DashboardStats> {
        const [
            totalAssets,
            totalValueResult,
            activeLoans,
            assetsByCondition,
            assetsByCategory,
        ] = await Promise.all([
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

        // Format response
        return {
            totalAssets,
            totalValue: Number(totalValueResult._sum.harga || 0),
            activeLoans,
            assetsByCondition: assetsByCondition.reduce((acc, curr) => {
                acc[curr.kondisi] = curr._count.id;
                return acc;
            }, {} as Record<string, number>),
            assetsByCategory: assetsByCategory.reduce((acc, curr) => {
                const categoryName = curr.categoryId ? categoryMap.get(curr.categoryId) || 'Unknown' : 'Uncategorized';
                acc[categoryName] = curr._count.id;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}
