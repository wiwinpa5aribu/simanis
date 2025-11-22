/**
 * Dashboard API - Menangani data statistik dan aktivitas dashboard
 * Menyediakan fungsi untuk mengambil statistik dan aktivitas terbaru
 */

import { api } from './client'
import { logger } from '../utils/logger'
import { z } from 'zod'
// import { ERROR_MESSAGES } from '../../constants'

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

/**
 * Get Dashboard Stats - Mendapatkan statistik dashboard
 * @returns Dashboard statistics
 * @throws Error jika gagal mengambil data
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    logger.info('Dashboard API', 'Mengambil statistik dashboard')

    const response = await api.get<DashboardStats>('/dashboard/stats')

    const dashboardStatsSchema = z.object({
      total_assets: z.number(),
      assets_by_condition: z.object({
        Baik: z.number(),
        'Rusak Ringan': z.number(),
        'Rusak Berat': z.number(),
        Hilang: z.number(),
      }),
      assets_by_category: z.array(
        z.object({
          category_name: z.string(),
          count: z.number(),
        })
      ),
      active_loans: z.number(),
    })

    const parsed = dashboardStatsSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.warning(
        'Dashboard API',
        'Response tidak valid, menggunakan mock data',
        { issues: parsed.error.issues }
      )
      const { mockDashboardStats } = await import('./mock/dashboard.mock')
      return mockDashboardStats
    }

    logger.success('Dashboard API', 'Berhasil mengambil statistik dashboard', {
      totalAssets: parsed.data.total_assets,
      activeLoans: parsed.data.active_loans,
    })

    return parsed.data
  } catch (error: unknown) {
    logger.warning(
      'Dashboard API',
      'Gagal mengambil statistik dari backend, menggunakan mock data',
      { error }
    )

    // Mock data untuk development (hapus saat backend siap)
    const { mockDashboardStats } = await import('./mock/dashboard.mock')
    return mockDashboardStats
  }
}

/**
 * Get Recent Activities - Mendapatkan aktivitas terbaru
 * @param limit - Jumlah maksimal aktivitas yang diambil (default: 10)
 * @returns Array of recent activities
 * @throws Error jika gagal mengambil data
 */
export const getRecentActivities = async (
  limit: number = 10
): Promise<RecentActivity[]> => {
  try {
    logger.info('Dashboard API', `Mengambil ${limit} aktivitas terbaru`)

    const response = await api.get<RecentActivity[]>('/dashboard/activities', {
      params: { limit },
    })

    const recentActivitySchema = z.array(
      z.object({
        id: z.number(),
        type: z.enum(['asset', 'mutation', 'loan', 'inventory']),
        title: z.string(),
        description: z.string(),
        timestamp: z.string(),
        link: z.string().optional(),
      })
    )

    const parsed = recentActivitySchema.safeParse(response.data)
    if (!parsed.success) {
      logger.warning(
        'Dashboard API',
        'Response aktivitas tidak valid, menggunakan mock data',
        { issues: parsed.error.issues }
      )
      const { mockRecentActivities } = await import('./mock/dashboard.mock')
      return mockRecentActivities.slice(0, limit)
    }

    logger.success(
      'Dashboard API',
      `Berhasil mengambil ${parsed.data.length} aktivitas`
    )

    return parsed.data
  } catch (error: unknown) {
    logger.warning(
      'Dashboard API',
      'Gagal mengambil aktivitas dari backend, menggunakan mock data',
      { error }
    )

    // Mock data untuk development (hapus saat backend siap)
    const { mockRecentActivities } = await import('./mock/dashboard.mock')
    return mockRecentActivities.slice(0, limit)
  }
}
