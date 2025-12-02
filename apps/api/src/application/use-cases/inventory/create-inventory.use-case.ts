import { InventoryCheck } from '@simanis/database'
import { IAssetRepository } from '../../../domain/repositories/asset.repository'
import { IAuditRepository } from '../../../domain/repositories/audit.repository'
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'
import { CreateInventoryInput } from '../../validators/inventory.validators'

export class CreateInventoryUseCase {
  constructor(
    private inventoryRepository: IInventoryRepository,
    private assetRepository: IAssetRepository,
    private auditRepository: IAuditRepository
  ) {}

  async execute(
    data: CreateInventoryInput,
    checkerId: number
  ): Promise<InventoryCheck> {
    // 1. Find asset by QR code
    const asset = await this.assetRepository.findByQRCode(data.qrCodeScanned)
    if (!asset) {
      throw new NotFoundError(
        `Asset dengan QR Code ${data.qrCodeScanned} tidak ditemukan`
      )
    }

    // 2. Create inventory check record
    const inventoryCheck = await this.inventoryRepository.create({
      asset: { connect: { id: asset.id } },
      checker: { connect: { id: checkerId } },
      kondisi: data.kondisi,
      photoUrl: data.photoUrl,
      note: data.note,
      qrCodeScanned: data.qrCodeScanned,
    })

    // 3. Update asset condition if changed
    if (asset.kondisi !== data.kondisi) {
      await this.assetRepository.update(asset.id, {
        kondisi: data.kondisi,
      })

      // Log asset update
      await this.auditRepository.create({
        entityType: 'Asset',
        entityId: asset.id,
        action: 'UPDATE',
        userId: checkerId,
        fieldChanged: {
          field: 'kondisi',
          oldValue: asset.kondisi,
          newValue: data.kondisi,
          reason: 'Inventory Check',
        },
      })
    }

    // 4. Log inventory check creation
    await this.auditRepository.create({
      entityType: 'InventoryCheck',
      entityId: inventoryCheck.id,
      action: 'CREATE',
      userId: checkerId,
      fieldChanged: {
        assetId: asset.id,
        kondisi: data.kondisi,
      },
    })

    return inventoryCheck
  }
}
