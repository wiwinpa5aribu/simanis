/**
 * Service Factory
 * Factory untuk membuat service instances dengan adapter yang berbeda
 * Memungkinkan switch antara HTTP (web) dan Tauri (desktop)
 */

import type {
  IAssetService,
  IAuthService,
  ICategoryService,
  ILoanService,
  ILocationService,
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
export async function createServices(
  adapter: ServiceAdapter
): Promise<Services> {
  if (adapter.type === 'tauri') {
    // TODO: Implement Tauri adapter when needed
    throw new Error('Tauri adapter not implemented yet')
  }

  // Default: HTTP adapter
  // Import services directly (ES modules)
  const { assetService } = await import('./asset.service')
  const { loanService } = await import('./loan.service')
  const { categoryService } = await import('./category.service')
  const { locationService } = await import('./location.service')

  return {
    asset: assetService,
    loan: loanService,
    category: categoryService,
    location: locationService,
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
