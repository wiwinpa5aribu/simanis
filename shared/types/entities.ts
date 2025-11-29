/**
 * Shared Entity Types
 * Digunakan oleh frontend dan backend untuk konsistensi tipe data
 */

// ============================================
// User & Auth
// ============================================
export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: UserRole
  createdAt?: Date
  updatedAt?: Date
}

export type UserRole = 'admin' | 'staff'

// ============================================
// Asset (Aset)
// ============================================
export interface Asset {
  id: string
  kodeAset: string
  namaBarang: string
  categoryId: number
  category?: Category
  kondisi: AssetCondition
  hargaPerolehan: number
  tanggalPerolehan: Date
  umurEkonomis: number
  roomId?: number
  room?: Room
  photoUrl?: string
  qrCode?: string
  createdAt: Date
  updatedAt: Date
}

export type AssetCondition = 'baik' | 'rusak_ringan' | 'rusak_berat' | 'hilang'

// ============================================
// Category (Kategori)
// ============================================
export interface Category {
  id: number
  kode: string
  nama: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================
// Location (Lokasi)
// ============================================
export interface Building {
  id: number
  nama: string
  floors?: Floor[]
}

export interface Floor {
  id: number
  buildingId: number
  nama: string
  rooms?: Room[]
}

export interface Room {
  id: number
  floorId: number
  nama: string
  floor?: Floor
}

// ============================================
// Loan (Peminjaman)
// ============================================
export interface Loan {
  id: string
  assetId: string
  asset?: Asset
  borrowerId: string
  borrower?: User
  tanggalPinjam: Date
  tanggalKembali?: Date
  status: LoanStatus
  note?: string
  createdAt: Date
  updatedAt: Date
}

export type LoanStatus = 'dipinjam' | 'dikembalikan' | 'terlambat'

// ============================================
// Inventory Check (Opname)
// ============================================
export interface InventoryCheck {
  id: string
  assetId: string
  asset?: Asset
  checkerId: string
  checker?: User
  kondisi: AssetCondition
  photoUrl?: string
  note?: string
  checkedAt: Date
}

// ============================================
// Depreciation (Penyusutan)
// ============================================
export interface DepreciationEntry {
  id: string
  assetId: string
  asset?: Asset
  tahun: number
  nilaiAwal: number
  penyusutan: number
  nilaiAkhir: number
  tanggalHitung: Date
}

// ============================================
// Mutation (Mutasi)
// ============================================
export interface Mutation {
  id: string
  assetId: string
  asset?: Asset
  fromRoomId?: number
  fromRoom?: Room
  toRoomId: number
  toRoom?: Room
  tanggalMutasi: Date
  note?: string
  createdBy: string
  createdAt: Date
}
