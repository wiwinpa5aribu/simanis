import { IAssetRepository } from '../../../domain/repositories/asset.repository';
import { CreateAssetInput } from '../../validators/asset.validators';
import { ConflictError } from '../../../shared/errors/conflict-error';
import { generateAssetQRCode } from '../../../shared/utils/qr-code.utils';
import { AssetDto } from '../../dto/asset.dto';
import { logger } from '../../../shared/logger/winston.logger';

export class CreateAssetUseCase {
    constructor(private assetRepository: IAssetRepository) { }

    async execute(data: CreateAssetInput, createdBy: number): Promise<AssetDto> {
        // Check if kode aset already exists
        const existing = await this.assetRepository.findByKodeAset(data.kodeAset);
        if (existing) {
            throw new ConflictError('Kode aset sudah digunakan');
        }

        // Generate QR code
        const qrCode = await generateAssetQRCode(data.kodeAset);

        // Convert tahunPerolehan string to Date if provided
        const tahunPerolehan = data.tahunPerolehan ? new Date(data.tahunPerolehan) : undefined;

        // Create asset
        const asset = await this.assetRepository.create({
            ...data,
            tahunPerolehan,
            qrCode,
            createdBy,
        });

        logger.info('Asset created', { assetId: asset.id, kodeAset: asset.kodeAset });

        // Return with category relation
        const assetWithCategory = await this.assetRepository.findById(asset.id);
        return assetWithCategory!;
    }
}
