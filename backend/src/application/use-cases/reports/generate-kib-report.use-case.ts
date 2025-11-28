import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export interface KibReportFilters {
  categoryId?: number;
  year?: number;
  roomId?: number;
}

export class GenerateKibReportUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(filters: KibReportFilters): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isDeleted: false,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year, 11, 31);
      where.tahunPerolehan = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (filters.roomId) {
      where.currentRoomId = filters.roomId;
    }

    const assets = await this.prisma.asset.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        kodeAset: 'asc',
      },
    });

    if (assets.length === 0) {
      throw new NotFoundError('Tidak ada data aset untuk laporan ini');
    }

    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('KIB Report');

    // Define Columns
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Kode Aset', key: 'kodeAset', width: 15 },
      { header: 'Nama Barang', key: 'namaBarang', width: 30 },
      { header: 'Merk/Type', key: 'merk', width: 20 },
      { header: 'Spesifikasi', key: 'spesifikasi', width: 30 },
      { header: 'Tahun', key: 'tahun', width: 10 },
      { header: 'Kondisi', key: 'kondisi', width: 15 },
      { header: 'Harga', key: 'harga', width: 15 },
      { header: 'Sumber Dana', key: 'sumberDana', width: 15 },
      { header: 'Kategori', key: 'kategori', width: 20 },
    ];

    // Add Data
    assets.forEach((asset, index) => {
      worksheet.addRow({
        no: index + 1,
        kodeAset: asset.kodeAset,
        namaBarang: asset.namaBarang,
        merk: asset.merk || '-',
        spesifikasi: asset.spesifikasi || '-',
        tahun: asset.tahunPerolehan
          ? new Date(asset.tahunPerolehan).getFullYear()
          : '-',
        kondisi: asset.kondisi,
        harga: Number(asset.harga),
        sumberDana: asset.sumberDana,
        kategori: asset.category?.name || '-',
      });
    });

    // Style Header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Generate Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
