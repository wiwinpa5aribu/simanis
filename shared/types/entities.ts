/**
 * Shared Entity Types
 * Digunakan oleh frontend dan backend untuk konsistensi tipe data
 * Disesuaikan dengan Prisma Schema (camelCase)
 */

// ============================================
// User & Auth
// ============================================
export interface User {
  id: number
  username: string
  name: string
  email?: string | null
  createdAt?: Date | string
}

export interface UserWithRoles extends User {
  roles: UserRole[]
}

export interface UserRole {
  userId: number
  roleId: number
  role?: Role
}

export interface Role {
  id: number
  name: string
}

export type RoleName = 'admin' | 'staff' | 'kepsek' | 'wakasek_sarpras' | 'bendahara_bos' | 'operator' | 'guru'

// ============================================
// Asset (Aset)
// ============================================
export interface Asset {
  id: number
  kodeAset: string
  namaBarang: string
  merk?: string | null
  spesifikasi?: string | null
  tahunPerolehan?: Date | string | null
  harga: number | string // Decimal from Prisma
  sumberDana: SumberDana
  kondisi: AssetCondition
  fotoUrl?: string | null
  qrCode: string
  tanggalPencatatan: Date | string
  createdBy?: number | null
  categoryId?: number | null
  masaManfaatTahun: number
  isDeleted: boolean
  deletedAt?: Date | string | null
  currentRoomId?: number | null
  // Relations
  category?: AssetCategory | null
  creator?: User | null
  currentRoom?: Room | null
}

export type AssetCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Hilang'
export type SumberDana = 'BOS' | 'APBD' | 'Hibah'

// ============================================
// Category (Kategori Aset)
// ============================================
export interface AssetCategory {
  id: number
  name: string
  description?: string | null
}

// ============================================
// Location (Lokasi)
// ============================================
export interface Building {
  id: number
  name: string
  floors?: Floor[]
}

export interface Floor {
  id: number
  buildingId: number
  levelNumber: number
  building?: Building
  rooms?: Room[]
}

export interface Room {
  id: number
  floorId: number
  name: string
  code?: string | null
  floor?: Floor
}

// ============================================
// Loan (Peminjaman)
// ============================================
export interface Loan {
  id: number
  requestedBy: number
  tanggalPinjam: Date | string
  tanggalKembali?: Date | string | null
  tujuanPinjam?: string | null
  status: LoanStatus
  catatan?: string | null
  // Relations
  requester?: User
  items?: LoanItem[]
}

export interface LoanItem {
  loanId: number
  assetId: number
  conditionBefore?: AssetCondition | null
  conditionAfter?: AssetCondition | null
  // Relations
  loan?: Loan
  asset?: Asset
}

export type LoanStatus = 'Dipinjam' | 'Dikembalikan' | 'Terlambat'

// ============================================
// Inventory Check (Opname)
// ============================================
export interface InventoryCheck {
  id: number
  assetId: number
  checkedBy: number
  checkedAt: Date | string
  photoUrl?: string | null
  qrCodeScanned?: string | null
  kondisi: AssetCondition
  note?: string | null
  // Relations
  asset?: Asset
  checker?: User
}

// ============================================
// Depreciation (Penyusutan)
// ============================================
export interface DepreciationEntry {
  id: number
  assetId: number
  tanggalHitung: Date | string
  nilaiPenyusutan: number | string // Decimal
  nilaiBuku: number | string // Decimal
  masaManfaatTahunSnapshot: number
  // Relations
  asset?: Asset
}

// ============================================
// Mutation (Mutasi Aset)
// ============================================
export interface AssetMutation {
  id: number
  assetId: number
  fromRoomId?: number | null
  toRoomId: number
  mutatedAt: Date | string
  note?: string | null
  // Relations
  asset?: Asset
  fromRoom?: Room | null
  toRoom?: Room
}

// ============================================
// Documents & Deletion
// ============================================
export interface AssetDocument {
  id: number
  assetId: number
  docType: string
  fileUrl: string
  uploadedBy?: number | null
  uploadedAt: Date | string
  // Relations
  asset?: Asset
  uploader?: User | null
}

export interface AssetDeletion {
  id: number
  assetId: number
  baDocumentId?: number | null
  deletedBy?: number | null
  deletedAt: Date | string
  approvalStatus?: string | null
  approvedBy?: number | null
  approvedAt?: Date | string | null
  // Relations
  asset?: Asset
  deleter?: User | null
}

// ============================================
// Audit Trail
// ============================================
export interface AuditLog {
  id: number
  entityType: string
  entityId: number
  userId?: number | null
  action: string
  timestamp: Date | string
  fieldChanged: Record<string, unknown>
  // Relations
  user?: User | null
}

// ============================================
// Password Reset
// ============================================
export interface PasswordResetToken {
  id: number
  userId: number
  token: string
  expiresAt: Date | string
  usedAt?: Date | string | null
  createdAt: Date | string
}

export interface LoginAttempt {
  id: number
  ip: string
  username: string
  success: boolean
  attemptedAt: Date | string
}
