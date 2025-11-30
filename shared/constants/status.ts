/**
 * Status Constants
 * Definisi status untuk berbagai entitas SIMANIS
 * Disesuaikan dengan Prisma Schema (Title Case)
 */

// ============================================
// Asset Condition (Kondisi Aset)
// ============================================
export const ASSET_CONDITIONS = {
  BAIK: 'Baik',
  RUSAK_RINGAN: 'Rusak Ringan',
  RUSAK_BERAT: 'Rusak Berat',
  HILANG: 'Hilang',
} as const

export type AssetConditionKey = keyof typeof ASSET_CONDITIONS
export type AssetConditionValue = (typeof ASSET_CONDITIONS)[AssetConditionKey]

export const ASSET_CONDITION_OPTIONS: { value: AssetConditionValue; label: string }[] = [
  { value: 'Baik', label: 'Baik' },
  { value: 'Rusak Ringan', label: 'Rusak Ringan' },
  { value: 'Rusak Berat', label: 'Rusak Berat' },
  { value: 'Hilang', label: 'Hilang' },
]

export const ASSET_CONDITION_COLORS: Record<AssetConditionValue, string> = {
  'Baik': 'green',
  'Rusak Ringan': 'yellow',
  'Rusak Berat': 'red',
  'Hilang': 'gray',
}

// ============================================
// Sumber Dana (Funding Source)
// ============================================
export const SUMBER_DANA = {
  BOS: 'BOS',
  APBD: 'APBD',
  HIBAH: 'Hibah',
} as const

export type SumberDanaKey = keyof typeof SUMBER_DANA
export type SumberDanaValue = (typeof SUMBER_DANA)[SumberDanaKey]

export const SUMBER_DANA_OPTIONS: { value: SumberDanaValue; label: string }[] = [
  { value: 'BOS', label: 'BOS' },
  { value: 'APBD', label: 'APBD' },
  { value: 'Hibah', label: 'Hibah' },
]

// ============================================
// Loan Status (Status Peminjaman)
// ============================================
export const LOAN_STATUS = {
  DIPINJAM: 'Dipinjam',
  DIKEMBALIKAN: 'Dikembalikan',
  TERLAMBAT: 'Terlambat',
} as const

export type LoanStatusKey = keyof typeof LOAN_STATUS
export type LoanStatusValue = (typeof LOAN_STATUS)[LoanStatusKey]

export const LOAN_STATUS_OPTIONS: { value: LoanStatusValue; label: string }[] = [
  { value: 'Dipinjam', label: 'Dipinjam' },
  { value: 'Dikembalikan', label: 'Dikembalikan' },
  { value: 'Terlambat', label: 'Terlambat' },
]

export const LOAN_STATUS_COLORS: Record<LoanStatusValue, string> = {
  'Dipinjam': 'blue',
  'Dikembalikan': 'green',
  'Terlambat': 'red',
}

// ============================================
// Report Types
// ============================================
export const REPORT_TYPES = {
  KIB: 'kib',
  DEPRECIATION: 'depreciation',
  INVENTORY: 'inventory',
  LOAN: 'loan',
} as const

export type ReportTypeKey = keyof typeof REPORT_TYPES
export type ReportTypeValue = (typeof REPORT_TYPES)[ReportTypeKey]

export const REPORT_TYPE_LABELS: Record<ReportTypeValue, string> = {
  kib: 'Kartu Inventaris Barang (KIB)',
  depreciation: 'Laporan Penyusutan',
  inventory: 'Laporan Opname',
  loan: 'Laporan Peminjaman',
}

// ============================================
// Export Formats
// ============================================
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
} as const

export type ExportFormatKey = keyof typeof EXPORT_FORMATS
export type ExportFormatValue = (typeof EXPORT_FORMATS)[ExportFormatKey]
