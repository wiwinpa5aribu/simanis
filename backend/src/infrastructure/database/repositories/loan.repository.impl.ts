import { PrismaClient } from '@prisma/client';
import { ILoanRepository, LoanWithRelations } from '../../../domain/repositories/loan.repository';
import { calculateSkip } from '../../../shared/utils/pagination.utils';

export class LoanRepositoryImpl implements ILoanRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: {
    page: number;
    pageSize: number;
    status?: string;
  }): Promise<{ loans: LoanWithRelations[]; total: number }> {
    const { page, pageSize, status } = params;
    const skip = calculateSkip(page, pageSize);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [loans, total] = await Promise.all([
      this.prisma.loan.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          requester: true,
          items: {
            include: {
              asset: true,
            },
          },
        },
        orderBy: { tanggalPinjam: 'desc' },
      }),
      this.prisma.loan.count({ where }),
    ]);

    return { loans, total };
  }

  async findById(id: number): Promise<LoanWithRelations | null> {
    return this.prisma.loan.findUnique({
      where: { id },
      include: {
        requester: true,
        items: {
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async create(data: {
    requestedBy: number;
    tanggalPinjam: Date;
    tujuanPinjam?: string;
    catatan?: string;
    items: {
      assetId: number;
      conditionBefore?: string;
    }[];
  }) {
    return this.prisma.loan.create({
      data: {
        requestedBy: data.requestedBy,
        tanggalPinjam: data.tanggalPinjam,
        tujuanPinjam: data.tujuanPinjam,
        catatan: data.catatan,
        status: 'Dipinjam',
        items: {
          create: data.items,
        },
      },
    });
  }

  async returnLoan(
    loanId: number,
    items: {
      assetId: number;
      conditionAfter: string;
    }[],
  ) {
    // Update loan items with condition after
    await Promise.all(
      items.map((item) =>
        this.prisma.loanItem.update({
          where: {
            loanId_assetId: {
              loanId,
              assetId: item.assetId,
            },
          },
          data: {
            conditionAfter: item.conditionAfter,
          },
        }),
      ),
    );

    // Update loan status and return date
    return this.prisma.loan.update({
      where: { id: loanId },
      data: {
        tanggalKembali: new Date(),
        status: 'Dikembalikan',
      },
    });
  }

  async countByStatus(status: string): Promise<number> {
    return this.prisma.loan.count({
      where: { status },
    });
  }
}
