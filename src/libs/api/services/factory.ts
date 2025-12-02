/**
 * Service Factory
 * Factory untuk membuat service instances dengan adapter yang berbeda
 * Memungkinkan switch antara HTTP (web) dan Tauri (desktop)
 */

import type {
  IAssetService,
  ILoanService,
  ICategoryService,
  ILocationService,
  IAuthService,
} from './types'

// ============================================
// Adapter Interface
// ============================================

export interface ServiceAdapter {
  type: 'http' | 'tauri'
}

// ============================================
// Service Container
// ============================================

export interface Services {
  asset: IAssetService
  loan: ILoanService
  category: ICategoryService
  location: ILocationService
  auth?: IAuthService
}

// ============================================
// Factory Function
// ============================================

/**
 * Create services with specified adapter
 *
 * @param adapter - Service adapter configuration
 * @returns Services container
 *
 * @example
 * // For web (HTTP)
 * const services = createServices({ type: 'http' })
 *
 * // For Tauri (desktop) - future
 * const services = createServices({ type: 'tauri' })
 */
export function createServices(adapter: ServiceAdapter): Services {
  if (adapter.type === 'tauri') {
    // TODO: Implement Tauri adapter when needed
    throw new Error('Tauri adapter not implemented yet')
  }

  // Default: HTTP adapter
  // Lazy import to avoid circular dependencies
  return {
    get asset() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('./asset.service').assetService
    },
    get loan() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('./loan.service').loanService
    },
    get category() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('./category.service').categoryService
    },
    get location() {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('./location.service').locationService
    },
  }
}

// ============================================
// Environment Detection
// ============================================

/**
 * Check if running in Tauri environment
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window
}

/**
 * Get default adapter based on environment
 */
export function getDefaultAdapter(): ServiceAdapter {
  return { type: isTauri() ? 'tauri' : 'http' }
}
