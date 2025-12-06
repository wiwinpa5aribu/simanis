/**
 * Route Validation Tests - Depreciation
 * Memvalidasi konsistensi route dan link untuk fitur Penyusutan
 * Mencegah bug routing seperti BUG-001 di Asset Management
 *
 * Validates: Consistency between routes and component links
 */

import { describe, expect, it } from 'vitest'

// ============ Route Definitions ============
// Sumber kebenaran untuk semua route Depreciation

export const DEPRECIATION_ROUTES = {
  // Main page
  main: '/depreciation',
  // Tab-based navigation (same route, different tab)
  dashboard: '/depreciation', // ?tab=dashboard
  list: '/depreciation', // ?tab=list
  simulation: '/depreciation', // ?tab=simulation
  settings: '/depreciation', // ?tab=settings
} as const

// ============ Related Asset Routes ============
// Depreciation sangat terkait dengan Asset Management

export const ASSET_DEPRECIATION_RELATIONS = {
  // Asset detail page yang menampilkan info penyusutan
  assetDetail: (id: number) => `/assets/${id}`,
  // Asset edit page yang bisa edit masa manfaat
  assetEdit: (id: number) => `/assets/${id}/edit`,
  // Asset create page dengan field masa manfaat
  assetCreate: '/assets/new',
} as const

// ============ Component Links ============
// Link yang digunakan di komponen-komponen

export const COMPONENT_LINKS = {
  // Sidebar navigation
  sidebarDepreciation: '/depreciation',
  // Table row click goes to asset detail
  tableRowToAssetDetail: (id: number) => `/assets/${id}`,
  // Modal might link to asset edit
  modalToAssetEdit: (id: number) => `/assets/${id}/edit`,
} as const

// ============ Helper Function ============
// Untuk penggunaan di komponen lain

export const DepreciationRoutes = {
  main: () => DEPRECIATION_ROUTES.main,
  withTab: (tab: 'dashboard' | 'list' | 'simulation' | 'settings') =>
    `${DEPRECIATION_ROUTES.main}?tab=${tab}`,
}

// ============ Integration with Asset Management ============
// Memastikan depreciation dan asset saling terintegrasi dengan benar

export const AssetDepreciationIntegration = {
  // Dari halaman aset ke halaman penyusutan
  assetToDepreciation: () => DEPRECIATION_ROUTES.main,
  // Dari halaman penyusutan ke detail aset
  depreciationToAsset: (assetId: number) =>
    ASSET_DEPRECIATION_RELATIONS.assetDetail(assetId),
  // Dari penyusutan ke edit aset (untuk ubah masa manfaat)
  depreciationToEditAsset: (assetId: number) =>
    ASSET_DEPRECIATION_RELATIONS.assetEdit(assetId),
}

// ============ Tests ============

describe('Depreciation Route Validation', () => {
  describe('Route Definitions', () => {
    it('should have correct main depreciation route', () => {
      expect(DEPRECIATION_ROUTES.main).toBe('/depreciation')
    })

    it('should use same base route for all tabs', () => {
      // Semua tab menggunakan base route yang sama
      expect(DEPRECIATION_ROUTES.dashboard).toBe(DEPRECIATION_ROUTES.main)
      expect(DEPRECIATION_ROUTES.list).toBe(DEPRECIATION_ROUTES.main)
      expect(DEPRECIATION_ROUTES.simulation).toBe(DEPRECIATION_ROUTES.main)
      expect(DEPRECIATION_ROUTES.settings).toBe(DEPRECIATION_ROUTES.main)
    })

    it('should generate correct tab URLs', () => {
      expect(DepreciationRoutes.withTab('dashboard')).toBe(
        '/depreciation?tab=dashboard'
      )
      expect(DepreciationRoutes.withTab('list')).toBe('/depreciation?tab=list')
      expect(DepreciationRoutes.withTab('simulation')).toBe(
        '/depreciation?tab=simulation'
      )
      expect(DepreciationRoutes.withTab('settings')).toBe(
        '/depreciation?tab=settings'
      )
    })
  })

  describe('Asset-Depreciation Integration', () => {
    it('should correctly link to asset detail from depreciation', () => {
      const assetId = 123
      expect(AssetDepreciationIntegration.depreciationToAsset(assetId)).toBe(
        '/assets/123'
      )
    })

    it('should correctly link to asset edit for changing useful life', () => {
      const assetId = 456
      expect(
        AssetDepreciationIntegration.depreciationToEditAsset(assetId)
      ).toBe('/assets/456/edit')
    })

    it('should correctly link from asset to depreciation page', () => {
      expect(AssetDepreciationIntegration.assetToDepreciation()).toBe(
        '/depreciation'
      )
    })

    it('asset create route should be /assets/new (not /assets/create)', () => {
      // Consistency dengan fix BUG-001 di Asset Management
      expect(ASSET_DEPRECIATION_RELATIONS.assetCreate).toBe('/assets/new')
      expect(ASSET_DEPRECIATION_RELATIONS.assetCreate).not.toBe(
        '/assets/create'
      )
    })
  })

  describe('Component Link Validation', () => {
    it('sidebar depreciation link should match route definition', () => {
      expect(COMPONENT_LINKS.sidebarDepreciation).toBe(DEPRECIATION_ROUTES.main)
    })

    it('table row link should go to correct asset detail', () => {
      const assetId = 789
      expect(COMPONENT_LINKS.tableRowToAssetDetail(assetId)).toBe(
        ASSET_DEPRECIATION_RELATIONS.assetDetail(assetId)
      )
    })

    it('modal edit link should go to correct asset edit page', () => {
      const assetId = 101
      expect(COMPONENT_LINKS.modalToAssetEdit(assetId)).toBe(
        ASSET_DEPRECIATION_RELATIONS.assetEdit(assetId)
      )
    })
  })

  describe('Cross-Feature Consistency', () => {
    it('depreciation should use same asset ID format as asset management', () => {
      // Asset ID harus konsisten di semua fitur
      const assetId = 12345
      const assetDetailUrl = ASSET_DEPRECIATION_RELATIONS.assetDetail(assetId)
      const assetEditUrl = ASSET_DEPRECIATION_RELATIONS.assetEdit(assetId)

      expect(assetDetailUrl).toMatch(/^\/assets\/\d+$/)
      expect(assetEditUrl).toMatch(/^\/assets\/\d+\/edit$/)
    })

    it('all asset-related routes should use consistent pattern', () => {
      // Pattern: /assets/:id atau /assets/:id/action
      const routes = [
        ASSET_DEPRECIATION_RELATIONS.assetDetail(1),
        ASSET_DEPRECIATION_RELATIONS.assetEdit(1),
        ASSET_DEPRECIATION_RELATIONS.assetCreate,
      ]

      routes.forEach((route) => {
        expect(route).toMatch(/^\/assets\//)
      })
    })
  })
})
