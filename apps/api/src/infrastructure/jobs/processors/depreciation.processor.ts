import { PrismaClient } from '@simanis/database'
import { logger } from '../../../shared/logger/winston.logger'

const prisma = new PrismaClient()

export const depreciationProcessor = async () => {
  logger.info('Starting depreciation calculation job')

  try {
    // 1. Get all assets that need depreciation
    // Logic: Assets with value > 0 and masaManfaat > 0
    const assets = await prisma.asset.findMany({
      where: {
        harga: { gt: 0 },
        masaManfaatTahun: { gt: 0 },
        isDeleted: false,
      },
    })

    logger.info(`Found ${assets.length} assets for depreciation calculation`)

    let processedCount = 0

    for (const asset of assets) {
      // Simple straight-line depreciation for now
      // Annual Depreciation = (Cost - Residual Value) / Useful Life
      // Assuming Residual Value = 0 for now

      const cost = Number(asset.harga)
      const usefulLife = asset.masaManfaatTahun
      const annualDepreciation = cost / usefulLife
      const monthlyDepreciation = annualDepreciation / 12

      // Calculate current book value
      // This is simplified. In real app, we need to sum up previous depreciations.
      // For now, we just log the calculation.

      // Create depreciation entry
      await prisma.depreciationEntry.create({
        data: {
          assetId: asset.id,
          tanggalHitung: new Date(),
          nilaiPenyusutan: monthlyDepreciation,
          nilaiBuku: cost - monthlyDepreciation, // Simplified
          masaManfaatTahunSnapshot: usefulLife,
        },
      })

      processedCount++
    }

    logger.info(
      `Depreciation calculation completed. Processed ${processedCount} assets.`
    )
    return { processed: processedCount }
  } catch (error) {
    logger.error('Depreciation calculation failed', { error })
    throw error
  }
}
