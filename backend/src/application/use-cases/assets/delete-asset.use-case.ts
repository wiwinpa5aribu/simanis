import { IAssetRepository } from '../../../domain/repositories/asset.repository';
import { IAuditRepository } from '../../../domain/repositories/audit.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';
import { ValidationError } from '../../../shared/errors/validation-error';

export interface DeleteAssetInput {
  beritaAcaraUrl: string;
}

export interface IAssetDocumentRepository {
  create(data: {
    assetId: number;
    docType: string;
    fileUrl: string;
    uploadedBy?: number;
  }): Promise<{ id: number }>;
}

export class DeleteAssetUseCase {
  constructor(
    private assetRepository: IAssetRepository,
    private auditRepository: IAuditRepository,
    private documentRepository?: IAssetDocumentRepository,
  ) {}

  async execute(id: number, data: DeleteAssetInput, deletedBy: number): Promise<void> {
    // Validate berita acara is provided
    if (!data.beritaAcaraUrl || data.beritaAcaraUrl.trim() === '') {
      throw new ValidationError('Berita Acara wajib dilampirkan untuk menghapus aset');
    }

    // Find existing asset
    const existing = await this.assetRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Aset tidak ditemukan');
    }

    if (existing.isDeleted) {
      throw new ValidationError('Aset sudah dihapus sebelumnya');
    }

    // Save berita acara document if repository provided
    if (this.documentRepository) {
      await this.documentRepository.create({
        assetId: id,
        docType: 'BERITA_ACARA_HAPUS',
        fileUrl: data.beritaAcaraUrl,
        uploadedBy: deletedBy,
      });
    }

    // Soft delete asset
    await this.assetRepository.softDelete(id, deletedBy);

    // Create audit log
    await this.auditRepository.create({
      entityType: 'asset',
      entityId: id,
      userId: deletedBy,
      action: 'DELETE',
      fieldChanged: {
        isDeleted: { from: false, to: true },
        beritaAcaraUrl: data.beritaAcaraUrl,
      },
    });
  }
}
