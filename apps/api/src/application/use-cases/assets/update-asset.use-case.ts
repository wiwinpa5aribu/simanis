import { Asset } from '@simanis/database'
import { IAssetRepository } from '../../../domain/repositories/asset.repository'
import { IAuditRepository } from '../../../domain/repositories/audit.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { UpdateAssetInput } from '../../validators/asset.validators'

export class UpdateAssetUseCase {
  constructor(
    private assetRepository: IAssetRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(
    id: number,
    data: UpdateAssetInput,
    updatedBy: number
  ): Promise<Asset> {
    // Find existing asset
    const existing = await this.assetRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Aset tidak ditemukan')
    }

    // Track changed fields for audit
    const changedFields = this.getChangedFields(existing, data)

    // Update asset
    const updated = await this.assetRepository.update(id, data)

    // Create audit log if there are changes
    if (Object.keys(changedFields).length > 0) {
      await this.auditRepository.create({
        entityType: 'asset',
        entityId: id,
        userId: updatedBy,
        action: 'UPDATE',
        fieldChanged: changedFields,
      })
    }

    return updated
  }

  /**
   * Compare existing asset with update data and return changed fields
   */
  private getChangedFields(
    existing: Asset,
    data: UpdateAssetInput
  ): Record<string, { from: unknown; to: unknown }> {
    const changes: Record<string, { from: unknown; to: unknown }> = {}

    const fieldsToCheck: (keyof UpdateAssetInput)[] = [
      'namaBarang',
      'merk',
      'spesifikasi',
      'kondisi',
      'fotoUrl',
      'categoryId',
      'currentRoomId',
    ]

    for (const field of fieldsToCheck) {
      if (data[field] !== undefined && data[field] !== existing[field]) {
        changes[field] = {
          from: existing[field],
          to: data[field],
        }
      }
    }

    return changes
  }
}
