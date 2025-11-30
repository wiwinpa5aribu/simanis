import { IAssetRepository } from '../../../domain/repositories/asset.repository';
import { CreateAssetInput } from '../../validators/asset.validators';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { generateAssetQRCode } from '../../../shared/utils/qr-code.utils';
import { AssetDto } from '../../dto/asset.dto';
import { logger } from '../../../shared/logger/winston.logger';

export class CreateAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(data: CreateAssetInput, createdBy: number): Promise<AssetDto> {
    // Generate kode aset if not provided
    let kodeAset = data.kodeAset;
    if (!kodeAset) {
      kodeAset = await this.generateKodeAset(data.categoryId);
    }

    // Check if kode aset already exists
    const existing = await this.assetRepository.findByKodeAset(kodeAset);
    if (existing) {
      throw new ConflictError('Kode aset sudah digunakan');
    }

    // Generate QR code
    const qrCode = await generateAssetQRCode(kodeAset);

    // Convert tahunPerolehan string to Date if provided
    const tahunPerolehan = data.tahunPerolehan ? new Date(data.tahunPerolehan) : undefined;

    // Create asset
    const asset = await this.assetRepository.create({
      ...data,
      kodeAset,
      tahunPerolehan,
      qrCode,
      createdBy,
    });

    logger.info('Asset created', { assetId: asset.id, kodeAset: asset.kodeAset });

    // Return with category relation
    const assetWithCategory = await this.assetRepository.findById(asset.id);
    return assetWithCategory!;
  }

  /**
   * Generate kode aset dengan format: SCH/KD/KAT/NOURUT
   * Contoh: SCH/2025/ELK/0001
   */
  private async generateKodeAset(categoryId?: number): Promise<string> {
    const year = new Date().getFullYear();
    
    // Get category code (default: GEN for general)
    let categoryCode = 'GEN';
    if (categoryId) {
      const categoryMap: Record<number, string> = {
        1: 'ELK', // Elektronik
        2: 'FRN', // Furniture
        3: 'KND', // Kendaraan
        4: 'OLR', // Alat Olahraga
        5: 'BKU', // Buku
      };
      categoryCode = categoryMap[categoryId] || 'GEN';
    }

    // Get next sequence number
    const lastAsset = await this.assetRepository.findLastByKodePattern(`SCH/${year}/${categoryCode}/%`);
    let sequence = 1;
    
    if (lastAsset) {
      const parts = lastAsset.kodeAset.split('/');
      const lastSeq = parseInt(parts[3], 10);
      if (!isNaN(lastSeq)) {
        sequence = lastSeq + 1;
      }
    }

    return `SCH/${year}/${categoryCode}/${sequence.toString().padStart(4, '0')}`;
  }
}
