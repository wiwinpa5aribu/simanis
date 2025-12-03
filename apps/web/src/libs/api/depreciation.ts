/**
 * Depreciation API - Menangani data penyusutan aset
 * Menyediakan fungsi untuk mengambil data penyusutan
 * Perhitungan dilakukan di backend, frontend hanya menampilkan
 */

import { api } from './client'

// ============ Types ============

export interface DepreciationEntry {
  id: number
  assetId: number
  kodeAset: string
  namaBarang: string
  categoryName?: string
  bulan: number
  tahun: number
  nilaiPenyusutan: number
  nilaiBuku: number
  akumulasiPenyusutan: number
  nilaiPerolehan: number
}

export interface DepreciationSummary {
  totalNilaiPerolehan: number
  totalAkumulasiPenyusutan: number
  totalNilaiBuku: number
  totalAssets: number
  fullyDepreciatedCount: number
}

export interface DepreciationListItem {
  id: number
  kodeAset: string
  namaBarang: string
  categoryName: string
  nilaiPerolehan: number
  masaManfaatTahun: number
  penyusutanPerBulan: number
  akumulasiPenyusutan: number
  nilaiBuku: number
  isFullyDepreciated: boolean
}

export interface DepreciationTrendItem {
  month: string // "2024-01"
  label: string // "Jan 2024"
  totalPenyusutan: number
  totalNilaiBuku: number
}

export interface AssetDepreciationHistory {
  asset: {
    id: number
    kodeAset: string
    namaBarang: string
    nilaiPerolehan: number
    masaManfaatTahun: number
  }
  currentBookValue: number
  totalDepreciation: number
  entries: {
    id: number
    bulan: number
    tahun: number
    nilaiPenyusutan: number
    nilaiBuku: number
    createdAt: string
  }[]
}


export interface SimulationProjection {
  month: number
  monthLabel: string
  nilaiBuku: number
  penyusutan: number
  akumulasiPenyusutan: number
}

export interface SimulateDepreciationResult {
  asset?: {
    id: number
    kodeAset: string
    namaBarang: string
    nilaiPerolehan: number
    masaManfaatTahun: number
    currentBookValue: number
  }
  projections: SimulationProjection[]
  estimatedEndDate: string | null
  totalDepreciationInPeriod: number
}

export interface CalculateDepreciationResult {
  processedCount: number
  skippedCount: number
  totalDepreciation: number
  period: {
    month: number
    year: number
  }
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// ============ API Functions ============

/**
 * GET /api/depreciation/summary
 * Mendapatkan ringkasan penyusutan
 */
export const getDepreciationSummary = async (params?: {
  categoryId?: number
  year?: number
}): Promise<DepreciationSummary> => {
  const response = await api.get<{ data: DepreciationSummary }>('/depreciation/summary', {
    params,
  })
  return response.data.data
}

/**
 * GET /api/depreciation/list
 * Mendapatkan daftar aset dengan info penyusutan
 */
export const getDepreciationList = async (params?: {
  categoryId?: number
  year?: number
  month?: number
  sortBy?: 'kodeAset' | 'namaBarang' | 'nilaiBuku' | 'akumulasiPenyusutan'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}): Promise<{ items: DepreciationListItem[]; meta: PaginationMeta }> => {
  const response = await api.get<{ data: DepreciationListItem[]; meta: PaginationMeta }>(
    '/depreciation/list',
    { params }
  )
  return { items: response.data.data, meta: response.data.meta }
}

/**
 * GET /api/depreciation/trend
 * Mendapatkan data trend penyusutan untuk chart
 */
export const getDepreciationTrend = async (params?: {
  categoryId?: number
  months?: number
}): Promise<DepreciationTrendItem[]> => {
  const response = await api.get<{ data: DepreciationTrendItem[] }>('/depreciation/trend', {
    params,
  })
  return response.data.data
}


/**
 * GET /api/depreciation/asset/:id/history
 * Mendapatkan riwayat penyusutan per aset
 */
export const getAssetDepreciationHistory = async (
  assetId: number
): Promise<AssetDepreciationHistory> => {
  const response = await api.get<{ data: AssetDepreciationHistory }>(
    `/depreciation/asset/${assetId}/history`
  )
  return response.data.data
}

/**
 * POST /api/depreciation/calculate
 * Menjalankan kalkulasi penyusutan untuk periode tertentu
 */
export const calculateDepreciation = async (params: {
  month: number
  year: number
}): Promise<CalculateDepreciationResult> => {
  const response = await api.post<{ data: CalculateDepreciationResult }>(
    '/depreciation/calculate',
    params
  )
  return response.data.data
}

/**
 * POST /api/depreciation/simulate
 * Simulasi proyeksi penyusutan
 */
export const simulateDepreciation = async (params: {
  assetId?: number
  categoryId?: number
  periodMonths: number
}): Promise<SimulateDepreciationResult> => {
  const response = await api.post<{ data: SimulateDepreciationResult }>(
    '/depreciation/simulate',
    params
  )
  return response.data.data
}

/**
 * GET /api/depreciation/report
 * Download laporan penyusutan dalam format Excel
 */
export const downloadDepreciationReport = async (params: {
  year: number
  month: number
  categoryId?: number
}): Promise<Blob> => {
  const response = await api.get('/depreciation/report', {
    params: { ...params, format: 'excel' },
    responseType: 'blob',
  })
  return response.data
}

/**
 * PUT /api/categories/:id/useful-life
 * Update default masa manfaat kategori
 */
export const updateCategoryUsefulLife = async (
  categoryId: number,
  defaultMasaManfaat: number
): Promise<{ id: number; name: string; defaultMasaManfaat: number }> => {
  const response = await api.put<{
    data: { id: number; name: string; defaultMasaManfaat: number }
  }>(`/categories/${categoryId}/useful-life`, { defaultMasaManfaat })
  return response.data.data
}
