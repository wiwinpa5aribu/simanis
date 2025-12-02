/**
 * Dashboard Types - Shared types untuk dashboard API dan mock
 */

/**
 * Interface untuk statistik dashboard
 */
export interface DashboardStats {
  total_assets: number
  assets_by_condition: {
    Baik: number
    'Rusak Ringan': number
    'Rusak Berat': number
    Hilang: number
  }
  assets_by_category: {
    category_name: string
    count: number
  }[]
  active_loans: number
  // Nilai aset untuk KIB
  total_value?: number
  depreciated_value?: number
  // Inventarisasi
  pending_inventory?: number
  last_inventory_date?: string
}

/**
 * Interface untuk aktivitas terbaru
 */
export interface RecentActivity {
  id: number
  type: 'asset' | 'mutation' | 'loan' | 'inventory'
  title: string
  description: string
  timestamp: string
  link?: string // Link ke detail (opsional)
}
