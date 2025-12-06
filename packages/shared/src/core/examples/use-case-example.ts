/**
 * Example: How to use the Contract-Based Module System
 *
 * Contoh implementasi use case dengan defensive programming patterns.
 * File ini untuk dokumentasi dan referensi.
 */

import {
  type AssetOutput,
  type CreateAssetInput,
  createLogger,
  Guard,
  ModuleRegistry,
  Result,
  type ResultError,
  SIMANISGuard,
  type UseCaseOutput,
  withModuleTracking,
} from '../index'

// 1. Register module saat startup
ModuleRegistry.register({
  name: 'CreateAssetUseCase',
  version: '1.0.0',
  description: 'Use case untuk membuat aset baru',
  layer: 'application',
  dependencies: ['AssetRepository', 'AuditLogService'],
})

// 2. Create logger untuk module ini
const logger = createLogger('CreateAssetUseCase')

// 3. Implement use case dengan defensive patterns
async function createAssetImpl(
  input: CreateAssetInput
): Promise<Result<UseCaseOutput<AssetOutput>, ResultError>> {
  const timer = logger.startTimer()
  const { context, data } = input

  logger.info('Creating asset', {
    correlationId: context.correlationId,
    kodeAset: data.kodeAset,
    userId: context.userId,
  })

  // 4. Validate input dengan Guards
  const validationResult = Guard.combine([
    SIMANISGuard.isValidAssetCode(data.kodeAset),
    Guard.againstEmpty(data.nama, 'nama'),
    SIMANISGuard.isValidAssetValue(data.nilaiPerolehan),
    SIMANISGuard.isValidKondisi(data.kondisi),
  ])

  if (validationResult.isErr()) {
    logger.warn('Validation failed', {
      correlationId: context.correlationId,
      error: validationResult.error,
    })
    return Result.err(validationResult.error)
  }

  // 5. Business logic (simplified example)
  try {
    // Simulate database operation
    const asset: AssetOutput = {
      id: `asset_${Date.now()}`,
      kodeAset: data.kodeAset,
      nama: data.nama,
      kategoriId: data.kategoriId,
      lokasiId: data.lokasiId,
      nilaiPerolehan: data.nilaiPerolehan,
      nilaiBuku: data.nilaiPerolehan, // Initial book value = acquisition value
      tanggalPerolehan: data.tanggalPerolehan,
      kondisi: data.kondisi,
      status: 'Aktif',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const duration = timer()
    logger.info('Asset created successfully', {
      correlationId: context.correlationId,
      assetId: asset.id,
      duration,
    })

    return Result.ok({
      data: asset,
      context,
      duration,
    })
  } catch (error) {
    const duration = timer()
    logger.error('Failed to create asset', {
      correlationId: context.correlationId,
      error: error instanceof Error ? error.message : String(error),
      duration,
    })

    return Result.fromError(
      'CREATE_ASSET_FAILED',
      error instanceof Error ? error.message : 'Unknown error',
      { originalError: error }
    )
  }
}

// 6. Wrap dengan module tracking
export const createAsset = withModuleTracking(
  'CreateAssetUseCase',
  createAssetImpl
)

// 7. Usage example
async function exampleUsage() {
  const result = await createAsset({
    context: {
      correlationId: 'req_123',
      userId: 'user_admin_001',
      userRole: 'admin',
      timestamp: new Date(),
    },
    data: {
      kodeAset: 'LAB-IPA-001',
      nama: 'Mikroskop Binokuler',
      kategoriId: 'cat_lab',
      lokasiId: 'loc_lab_ipa',
      nilaiPerolehan: 5000000,
      tanggalPerolehan: new Date(),
      kondisi: 'Baik',
    },
  })

  // 8. Handle result dengan match pattern
  result.match({
    ok: (output) => {
      logger.info('Asset created', { assetId: output.data.id, duration: output.duration })
    },
    err: (error) => {
      logger.error('Error creating asset', { code: error.code, message: error.message })
    },
  })

  // 9. Check system health
  const health = ModuleRegistry.getSystemHealth()
  logger.info('System health check', { status: health.status })
}

// Export for documentation
export { exampleUsage }
