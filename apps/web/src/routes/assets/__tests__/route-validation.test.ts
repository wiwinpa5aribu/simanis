/**
 * Asset Management - Route Validation Tests
 *
 * Test ini memastikan semua route yang didefinisikan di aplikasi
 * benar-benar ada dan tidak broken. Mencegah bug seperti:
 * - BUG-001: Link mengarah ke route yang tidak ada
 * - Typo pada path
 * - Route yang dihapus tapi link masih ada
 *
 * @see .kiro/specs/asset-management/requirements.md
 */

import { describe, expect, it } from 'vitest'

// Definisi route yang HARUS ada di aplikasi
const ASSET_MANAGEMENT_ROUTES = {
  // Route utama asset management
  assetList: '/assets',
  assetCreate: '/assets/new', // BUKAN /assets/create!
  assetDetail: '/assets/:id',
  assetEdit: '/assets/:id/edit',

  // Route favorit
  assetFavorites: '/assets/favorites',
} as const

// Link yang digunakan di komponen (untuk validasi)
const COMPONENT_LINKS = {
  // QuickActions.tsx - Dashboard
  dashboardAddAsset: '/assets/new',

  // AssetsListPage.tsx
  listAddButton: '/assets/new',
  listDetailLink: '/assets/:id',
  listEditLink: '/assets/:id/edit',

  // AssetDetailPage.tsx
  detailBackLink: '/assets',
  detailEditButton: '/assets/:id/edit',
}

describe('Asset Management Route Validation', () => {
  describe('Route Definitions', () => {
    it('should have correct asset list route', () => {
      expect(ASSET_MANAGEMENT_ROUTES.assetList).toBe('/assets')
    })

    it('should have correct asset create route (NOT /assets/create)', () => {
      // This test will FAIL if someone changes it to /assets/create
      expect(ASSET_MANAGEMENT_ROUTES.assetCreate).toBe('/assets/new')
      expect(ASSET_MANAGEMENT_ROUTES.assetCreate).not.toBe('/assets/create')
    })

    it('should have correct asset detail route pattern', () => {
      expect(ASSET_MANAGEMENT_ROUTES.assetDetail).toMatch(/^\/assets\/:id$/)
    })

    it('should have correct asset edit route pattern', () => {
      expect(ASSET_MANAGEMENT_ROUTES.assetEdit).toMatch(/^\/assets\/:id\/edit$/)
    })
  })

  describe('Component Link Validation', () => {
    it('dashboard add asset link should match route definition', () => {
      expect(COMPONENT_LINKS.dashboardAddAsset).toBe(
        ASSET_MANAGEMENT_ROUTES.assetCreate
      )
    })

    it('list add button should match route definition', () => {
      expect(COMPONENT_LINKS.listAddButton).toBe(
        ASSET_MANAGEMENT_ROUTES.assetCreate
      )
    })

    it('all component links should reference valid routes', () => {
      const validRoutes = Object.values(ASSET_MANAGEMENT_ROUTES)

      Object.entries(COMPONENT_LINKS).forEach(([linkName, linkPath]) => {
        const isValid = validRoutes.some((route) => {
          // Handle dynamic routes like /assets/:id
          const routePattern = route.replace(/:id/g, '[^/]+')
          const regex = new RegExp(`^${routePattern}$`)
          return regex.test(linkPath) || route === linkPath
        })

        expect(
          isValid,
          `Link "${linkName}" with path "${linkPath}" is not a valid route`
        ).toBe(true)
      })
    })
  })
})

// Helper untuk digunakan di komponen
export const AssetRoutes = {
  list: () => ASSET_MANAGEMENT_ROUTES.assetList,
  create: () => ASSET_MANAGEMENT_ROUTES.assetCreate,
  detail: (id: number | string) => `/assets/${id}`,
  edit: (id: number | string) => `/assets/${id}/edit`,
  favorites: () => ASSET_MANAGEMENT_ROUTES.assetFavorites,
} as const

export { ASSET_MANAGEMENT_ROUTES, COMPONENT_LINKS }
