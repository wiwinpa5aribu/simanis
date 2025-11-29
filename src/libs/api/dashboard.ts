/**
 * Dashboard API - Menangani data statistik dan aktivitas dashboard
 * Menyediakan fungsi untuk mengambil statistik dan aktivitas terbaru
 */

import { api } from './client'
import { logger } from '../utils/logger'
import { z } from 'zod'
import { env } from '../utils/env'
import { mockDashboardStats, mockRecentActivities } from './mock/dashboard.mock'

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

/**
 * Get Dashboard Stats - Mendapatkan statistik dashboard
 * @returns Dashboard statistics
 * @throws Error jika gagal mengambil data
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    logger.info('Dashboard API', 'Mengambil statistik dashboard')

    // Use mock data if enabled
    if (env.useMockApi) {
      logger.info('Dashboard API', 'Menggunakan mock data')
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate delay
      return mockDashboardStats
    }

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
      logger.error('Dashboard API', 'Response tidak valid', {
        issues: parsed.error.issues,
      })
      throw new Error('Response statistik dashboard tidak valid')
    }

    logger.success('Dashboard API', 'Berhasil mengambil statistik dashboard', {
      totalAssets: parsed.data.total_assets,
      activeLoans: parsed.data.active_loans,
    })

    return parsed.data
  } catch (error: unknown) {
    logger.error('Dashboard API', 'Gagal mengambil statistik dashboard', error)
    throw error
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

    // Use mock data if enabled
    if (env.useMockApi) {
      logger.info('Dashboard API', 'Menggunakan mock aktivitas')
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate delay
      return mockRecentActivities.slice(0, limit)
    }

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
      logger.error('Dashboard API', 'Response aktivitas tidak valid', {
        issues: parsed.error.issues,
      })
      throw new Error('Response aktivitas tidak valid')
    }

    logger.success(
      'Dashboard API',
      `Berhasil mengambil ${parsed.data.length} aktivitas`
    )

    return parsed.data
  } catch (error: unknown) {
    logger.error('Dashboard API', 'Gagal mengambil aktivitas', error)
    throw error
  }
}
