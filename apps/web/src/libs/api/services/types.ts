/**
 * API Service Types
 * Interface dan types untuk service layer abstraction
 * Memungkinkan switch antara HTTP (web) dan Tauri (desktop)
 */

// ============================================
// Common Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

// ============================================
// Asset Service Interface
// ============================================

export interface AssetFilters extends PaginationParams {
  search?: string
  categoryId?: number
  kondisi?: string
  roomId?: number
  buildingId?: number
}

export interface IAssetService {
  getAll(filters?: AssetFilters): Promise<PaginatedResponse<Asset>>
  getById(id: number): Promise<Asset>
  getByCode(code: string): Promise<Asset>
  create(data: CreateAssetData): Promise<Asset>
  update(id: number, data: UpdateAssetData): Promise<Asset>
  delete(id: number): Promise<void>
  uploadPhoto(id: number, file: File): Promise<Asset>
  getQrCode(id: number): Promise<string>
  getMutations(assetId: number): Promise<AssetMutation[]>
}

// ============================================
// Loan Service Interface
// ============================================

export interface LoanFilters extends PaginationParams {
  status?: string
  requestedBy?: number
  assetId?: number
  startDate?: string
  endDate?: string
}

export interface ILoanService {
  getAll(filters?: LoanFilters): Promise<PaginatedResponse<Loan>>
  getById(id: number): Promise<LoanDetail>
  create(data: CreateLoanData): Promise<Loan>
  return(id: number, data: ReturnLoanData): Promise<Loan>
}

// ============================================
// Category Service Interface
// ============================================

export interface ICategoryService {
  getAll(): Promise<Category[]>
  getById(id: number): Promise<Category>
  create(data: CreateCategoryData): Promise<Category>
  update(id: number, data: UpdateCategoryData): Promise<Category>
  delete(id: number): Promise<void>
}

// ============================================
// Location Service Interface
// ============================================

export interface ILocationService {
  getBuildings(): Promise<Building[]>
  getFloors(buildingId: number): Promise<Floor[]>
  getRooms(floorId: number): Promise<Room[]>
  createBuilding(data: CreateBuildingData): Promise<Building>
  createFloor(data: CreateFloorData): Promise<Floor>
  createRoom(data: CreateRoomData): Promise<Room>
}

// ============================================
// Auth Service Interface
// ============================================

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  logout(): Promise<void>
  refreshToken(): Promise<string>
  getCurrentUser(): Promise<User>
}

// ============================================
// Entity Types (simplified for service layer)
// ============================================

export interface Asset {
  id: number
  kodeAset: string
  namaBarang: string
  merk: string | null
  spesifikasi: string | null
  tahunPerolehan: string | null
  harga: number
  sumberDana: string
  kondisi: string
  fotoUrl: string | null
  qrCode: string
  categoryId: number | null
  masaManfaatTahun: number
  currentRoomId: number | null
  isDeleted: boolean
  category?: Category | null
  currentRoom?: Room | null
}

export interface CreateAssetData {
  kodeAset: string
  namaBarang: string
  merk?: string
  spesifikasi?: string
  tahunPerolehan?: string
  harga: number
  sumberDana: string
  kondisi: string
  categoryId?: number
  masaManfaatTahun?: number
  currentRoomId?: number
}

export interface UpdateAssetData {
  kodeAset?: string
  namaBarang?: string
  merk?: string
  spesifikasi?: string
  kondisi?: string
  categoryId?: number
  currentRoomId?: number
}

export interface AssetMutation {
  id: number
  assetId: number
  fromRoomId: number | null
  toRoomId: number
  mutatedAt: string
  note: string | null
  fromRoom?: { id: number; name: string } | null
  toRoom?: { id: number; name: string }
}

export interface Loan {
  id: number
  requestedBy: number
  tanggalPinjam: string
  tanggalKembali: string | null
  tujuanPinjam: string | null
  status: string
  catatan: string | null
}

export interface LoanItem {
  loanId: number
  assetId: number
  conditionBefore: string | null
  conditionAfter: string | null
}

export interface LoanDetail extends Loan {
  requester: {
    id: number
    name: string
    username: string
    email: string | null
  }
  items: Array<
    LoanItem & {
      asset: {
        id: number
        kodeAset: string
        namaBarang: string
        merk: string | null
        kondisi: string
      }
    }
  >
}

export interface CreateLoanData {
  tanggalPinjam: string
  tujuanPinjam?: string
  catatan?: string
  items: Array<{
    assetId: number
    conditionBefore?: string
  }>
}

export interface ReturnLoanData {
  items: Array<{
    assetId: number
    conditionAfter: string
  }>
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface CreateCategoryData {
  name: string
  description?: string
}

export interface UpdateCategoryData {
  name?: string
  description?: string
}

export interface Building {
  id: number
  name: string
  floors?: Floor[]
}

export interface Floor {
  id: number
  buildingId: number
  levelNumber: number
  rooms?: Room[]
}

export interface Room {
  id: number
  floorId: number
  name: string
  code: string | null
}

export interface CreateBuildingData {
  name: string
}

export interface CreateFloorData {
  buildingId: number
  levelNumber: number
}

export interface CreateRoomData {
  floorId: number
  name: string
  code?: string
}

export interface User {
  id: number
  name: string
  email: string | null
  username: string
  roles: string[]
}
