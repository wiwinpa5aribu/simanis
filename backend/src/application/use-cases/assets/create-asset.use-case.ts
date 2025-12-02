import { IAssetRepository } from '../../../domain/repositories/asset.repository';
import { CreateAssetInput } from '../../validators/asset.validators';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { generateAssetQRCode } from '../../../shared/utils/qr-code.utils';
import { AssetDto } from '../../dto/asset.dto';
import { logger } from '../../../shared/logger/winston.logger';
import { AssetCodeGeneratorService } from '../../../infrastructure/services/asset-code-generator.service';

export class CreateAssetUseCase {
  constructor(
    private assetRepository: IAssetRepository,
    private assetCodeGenerator?: AssetCodeGeneratorService
  ) {}

  async execute(data: CreateAssetInput, createdBy: number): Promise<AssetDto> {
    // Generate kode aset using AssetCodeGenerator service
    let kodeAset = data.kodeAset;
    if (!kodeAset || kodeAset.startsWith('TEMP-')) {
      if (this.assetCodeGenerator) {
        kodeAset = await this.assetCodeGenerator.generateCode(data.categoryId);
      } else {
        // Fallback to simple generation if service not provided
        kodeAset = await this.generateKodeAsetFallback(data.categoryId);
      }
    }

    // Check if kode aset already exists
    const existing = await this.assetRepository.findByKodeAset(kodeAset);
    if (existing) {
      throw new ConflictError('Kode aset sudah digunakan');
    }

    // Generate QR code from kode aset
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
   * Fallback kode aset generation when AssetCodeGenerator service is not available
   * Format: SCH/XX/YYY/NNN
   */
  private async generateKodeAsetFallback(categoryId?: number): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    
    // Get category code (default: GEN for general)
    const categoryMap: Record<number, string> = {
      1: 'ELK', // Elektronik
      2: 'FRN', // Furniture
      3: 'KND', // Kendaraan
      4: 'OLR', // Alat Olahraga
      5: 'BKU', // Buku
    };
    const categoryCode = categoryId ? (categoryMap[categoryId] || 'GEN') : 'GEN';

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

    return `SCH/${year}/${categoryCode}/${sequence.toString().padStart(3, '0')}`;
  }
}
