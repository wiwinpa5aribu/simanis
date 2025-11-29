import { PrismaClient, DepreciationEntry } from '@prisma/client';
import { calculatePagination, calculateSkip } from '../../../shared/utils/pagination.utils';

export interface DepreciationFilters {
  assetId?: number;
  year?: number;
}

export interface DepreciationListDto {
  entries: DepreciationEntry[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class GetDepreciationUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(params: {
    page?: number;
    pageSize?: number;
    filters?: DepreciationFilters;
  }): Promise<DepreciationListDto> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = calculateSkip(page, pageSize);
    const filters = params.filters || {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (filters.assetId) {
      where.assetId = filters.assetId;
    }

    if (filters.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year, 11, 31);
      where.tanggalHitung = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [entries, total] = await Promise.all([
      this.prisma.depreciationEntry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          tanggalHitung: 'desc',
        },
        include: {
          asset: {
            select: {
              id: true,
              kodeAset: true,
              namaBarang: true,
            },
          },
        },
      }),
      this.prisma.depreciationEntry.count({ where }),
    ]);

    const meta = calculatePagination(total, page, pageSize);

    return {
      entries,
      meta,
    };
  }
}
