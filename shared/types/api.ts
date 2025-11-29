/**
 * Shared API Types
 * Request/Response types untuk konsistensi antara frontend dan backend
 */

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
    id: string
    username: string
    name: string
    role: string
  }
  token: string
}

// ============================================
// Asset API
// ============================================
export interface AssetFilters {
  search?: string
  categoryId?: number
  kondisi?: string
  roomId?: number
  buildingId?: number
}

export interface CreateAssetRequest {
  namaBarang: string
  categoryId: number
  kondisi: string
  hargaPerolehan: number
  tanggalPerolehan: string
  umurEkonomis: number
  roomId?: number
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  id: string
}

// ============================================
// Loan API
// ============================================
export interface LoanFilters {
  status?: string
  borrowerId?: string
  assetId?: string
  startDate?: string
  endDate?: string
}

export interface CreateLoanRequest {
  assetId: string
  borrowerId: string
  tanggalPinjam: string
  note?: string
}

export interface ReturnLoanRequest {
  loanId: string
  tanggalKembali: string
  note?: string
}

// ============================================
// Inventory Check API
// ============================================
export interface InventoryFilters {
  assetId?: string
  checkerId?: string
  kondisi?: string
  startDate?: string
  endDate?: string
}

export interface CreateInventoryCheckRequest {
  assetId: string
  kondisi: string
  photoUrl?: string
  note?: string
}

// ============================================
// Depreciation API
// ============================================
export interface DepreciationFilters {
  assetId?: string
  year?: number
}

// ============================================
// Report API
// ============================================
export interface ReportParams {
  type: 'kib' | 'depreciation' | 'inventory' | 'loan'
  format: 'pdf' | 'excel'
  filters?: Record<string, unknown>
}
