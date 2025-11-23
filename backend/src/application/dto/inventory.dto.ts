import { InventoryCheck, Asset, User } from '@prisma/client';

export interface InventoryDto {
    id: number;
    assetId: number;
    checkerId: number;
    kondisi: string;
    photoUrl: string | null;
    note: string | null;
    createdAt: Date;
    asset?: {
        id: number;
        kode: string;
        nama: string;
        category: {
            id: number;
            name: string;
        };
    };
    checker?: {
        id: number;
        name: string;
        username: string;
    };
}

export interface InventoryListDto {
    checks: InventoryDto[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
