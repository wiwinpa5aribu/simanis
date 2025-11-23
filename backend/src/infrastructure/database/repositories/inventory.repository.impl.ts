import { PrismaClient, InventoryCheck, Prisma } from '@prisma/client';
import { IInventoryRepository, InventoryFilters } from '../../../../domain/repositories/inventory.repository';

export class InventoryRepositoryImpl implements IInventoryRepository {
    constructor(private prisma: PrismaClient) { }

    async create(data: Prisma.InventoryCheckCreateInput): Promise<InventoryCheck> {
        return this.prisma.inventoryCheck.create({
            data,
            include: {
                asset: true,
                checker: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
        });
    }

    async findAll(
        skip: number,
        take: number,
        filters: InventoryFilters
    ): Promise<{ checks: InventoryCheck[]; total: number }> {
        const where: Prisma.InventoryCheckWhereInput = {};

        if (filters.assetId) {
            where.assetId = filters.assetId;
        }

        if (filters.checkerId) {
            where.checkerId = filters.checkerId;
        }

        if (filters.condition) {
            where.kondisi = filters.condition;
        }

        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.createdAt.lte = filters.endDate;
            }
        }

        const [checks, total] = await Promise.all([
            this.prisma.inventoryCheck.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    asset: {
                        select: {
                            id: true,
                            kode: true,
                            nama: true,
                            category: true,
                        },
                    },
                    checker: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    },
                },
            }),
            this.prisma.inventoryCheck.count({ where }),
        ]);

        return { checks, total };
    }

    async findById(id: number): Promise<InventoryCheck | null> {
        return this.prisma.inventoryCheck.findUnique({
            where: { id },
            include: {
                asset: true,
                checker: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
        });
    }
}
