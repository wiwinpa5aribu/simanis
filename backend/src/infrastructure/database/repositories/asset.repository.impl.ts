import { PrismaClient } from '@prisma/client';
import {
    IAssetRepository,
    AssetFilters,
    AssetWithRelations,
} from '../../../domain/repositories/asset.repository';
import { calculateSkip } from '../../../shared/utils/pagination.utils';

export class AssetRepositoryImpl implements IAssetRepository {
    constructor(private prisma: PrismaClient) { }

    async findAll(params: {
        page: number;
        pageSize: number;
        filters?: AssetFilters;
    }): Promise<{ assets: AssetWithRelations[]; total: number }> {
        const { page, pageSize, filters } = params;
        const skip = calculateSkip(page, pageSize);

        const where: any = {
            isDeleted: filters?.isDeleted ?? false,
        };

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters?.kondisi) {
            where.kondisi = filters.kondisi;
        }

        if (filters?.search) {
            where.OR = [
                { kodeAset: { contains: filters.search } },
                { namaBarang: { contains: filters.search } },
                { merk: { contains: filters.search } },
            ];
        }

        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    category: true,
                    mutations: {
                        orderBy: { mutatedAt: 'desc' },
                        take: 5,
                    },
                },
                orderBy: { tanggalPencatatan: 'desc' },
            }),
            this.prisma.asset.count({ where }),
        ]);

        return { assets, total };
    }

    async findById(id: number): Promise<AssetWithRelations | null> {
        return this.prisma.asset.findUnique({
            where: { id },
            include: {
                category: true,
                mutations: {
                    orderBy: { mutatedAt: 'desc' },
                },
            },
        });
    }

    async findByKodeAset(kodeAset: string) {
        return this.prisma.asset.findUnique({
            where: { kodeAset },
        });
    }

    async findByQRCode(qrCode: string) {
        return this.prisma.asset.findUnique({
            where: { qrCode },
        });
    }

    async create(data: {
        kodeAset: string;
        namaBarang: string;
        merk?: string;
        spesifikasi?: string;
        tahunPerolehan?: Date;
        harga: number;
        sumberDana: string;
        kondisi: string;
        fotoUrl?: string;
        qrCode: string;
        createdBy?: number;
        categoryId?: number;
        masaManfaatTahun?: number;
        currentRoomId?: number;
    }) {
        return this.prisma.asset.create({
            data,
        });
    }

    async update(
        id: number,
        data: {
            namaBarang?: string;
            merk?: string;
            spesifikasi?: string;
            kondisi?: string;
            fotoUrl?: string;
            categoryId?: number;
            currentRoomId?: number;
        }
    ) {
        return this.prisma.asset.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: number, deletedBy: number): Promise<void> {
        await this.prisma.asset.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });

        // Create deletion record
        await this.prisma.assetDeletion.create({
            data: {
                assetId: id,
                deletedBy,
            },
        });
    }

    async count(filters?: AssetFilters): Promise<number> {
        const where: any = {
            isDeleted: filters?.isDeleted ?? false,
        };

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters?.kondisi) {
            where.kondisi = filters.kondisi;
        }

        return this.prisma.asset.count({ where });
    }
}
