/**
 * Shared API Types
 * Request/Response types untuk konsistensi antara frontend dan backend
 * Disesuaikan dengan Prisma Schema (camelCase)
 */

import type { AssetCondition, LoanStatus, SumberDana } from './entities'

// ============================================
// Generic API Response
// ============================================
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

// ============================================
// Pagination
// ============================================
export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ============================================
// Auth API
// ============================================
export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: {
    id: number
    username: string
    name: string
    roles: string[]
  }
  token: string
  expiresIn: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

// ============================================
// Asset API
// ============================================
export interface AssetFilters extends PaginationParams {
  search?: string
  categoryId?: number
  kondisi?: AssetCondition
  roomId?: number
  buildingId?: number
}

export interface CreateAssetRequest {
  namaBarang: string
  merk?: string
  spesifikasi?: string
  tahunPerolehan?: string
  harga: number
  sumberDana: SumberDana
  kondisi: AssetCondition
  categoryId?: number
  masaManfaatTahun?: number
  currentRoomId?: number
}

export interface UpdateAssetRequest {
  namaBarang?: string
  merk?: string
  spesifikasi?: string
  kondisi?: AssetCondition
  categoryId?: number
  currentRoomId?: number
}

// ============================================
// Loan API
// ============================================
export interface LoanFilters extends PaginationParams {
  status?: LoanStatus
  requestedBy?: number
  assetId?: number
  startDate?: string
  endDate?: string
}

export interface CreateLoanRequest {
  tanggalPinjam: string
  tujuanPinjam?: string
  catatan?: string
  items: Array<{
    assetId: number
    conditionBefore?: AssetCondition
  }>
}

export interface ReturnLoanRequest {
  items: Array<{
    assetId: number
    conditionAfter: AssetCondition
  }>
}

// ============================================
// Inventory Check API
// ============================================
export interface InventoryFilters extends PaginationParams {
  assetId?: number
  checkerId?: number
  kondisi?: AssetCondition
  startDate?: string
  endDate?: string
}

export interface CreateInventoryCheckRequest {
  assetId: number
  kondisi: AssetCondition
  qrCodeScanned?: string
  photoUrl?: string
  note?: string
}

// ============================================
// Depreciation API
// ============================================
export interface DepreciationFilters extends PaginationParams {
  assetId?: number
  year?: number
}

// ============================================
// Category API
// ============================================
export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
}

// ============================================
// Location API
// ============================================
export interface CreateBuildingRequest {
  name: string
}

export interface CreateFloorRequest {
  buildingId: number
  levelNumber: number
}

export interface CreateRoomRequest {
  floorId: number
  name: string
  code?: string
}

// ============================================
// Report API
// ============================================
export interface ReportParams {
  type: 'kib' | 'depreciation' | 'inventory' | 'loan'
  format: 'pdf' | 'excel'
  filters?: Record<string, unknown>
}
