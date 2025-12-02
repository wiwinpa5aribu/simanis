/**
 * API Services - Entry Point
 *
 * Service layer abstraction untuk API calls.
 * Memungkinkan switch antara HTTP adapter (web) dan Tauri adapter (desktop).
 *
 * Usage:
 * ```typescript
 * import { assetService, loanService } from '@/libs/api/services'
 *
 * // Get all assets
 * const assets = await assetService.getAll({ page: 1, pageSize: 10 })
 *
 * // Create asset
 * const newAsset = await assetService.create({ ... })
 * ```
 */

// Export services
export { assetService } from './asset.service'
export { categoryService } from './category.service'
// Export service factory for custom adapters
export { createServices, type ServiceAdapter } from './factory'
export { loanService } from './loan.service'
export { locationService } from './location.service'
// Export types
export * from './types'
