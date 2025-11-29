/**
 * Status Constants
 * Definisi status untuk berbagai entitas SIMANIS
 */

// ============================================
// Asset Condition (Kondisi Aset)
// ============================================
export const ASSET_CONDITIONS = {
  BAIK: 'baik',
  RUSAK_RINGAN: 'rusak_ringan',
  RUSAK_BERAT: 'rusak_berat',
  HILANG: 'hilang',
} as const

export type AssetConditionKey = keyof typeof ASSET_CONDITIONS
export type AssetConditionValue = (typeof ASSET_CONDITIONS)[AssetConditionKey]

export const ASSET_CONDITION_LABELS: Record<AssetConditionValue, string> = {
  baik: 'Baik',
  rusak_ringan: 'Rusak Ringan',
  rusak_berat: 'Rusak Berat',
  hilang: 'Hilang',
}

export const ASSET_CONDITION_COLORS: Record<AssetConditionValue, string> = {
  baik: 'green',
  rusak_ringan: 'yellow',
  rusak_berat: 'red',
  hilang: 'gray',
}

// ============================================
// Loan Status (Status Peminjaman)
// ============================================
export const LOAN_STATUS = {
  DIPINJAM: 'dipinjam',
  DIKEMBALIKAN: 'dikembalikan',
  TERLAMBAT: 'terlambat',
} as const

export type LoanStatusKey = keyof typeof LOAN_STATUS
export type LoanStatusValue = (typeof LOAN_STATUS)[LoanStatusKey]

export const LOAN_STATUS_LABELS: Record<LoanStatusValue, string> = {
  dipinjam: 'Dipinjam',
  dikembalikan: 'Dikembalikan',
  terlambat: 'Terlambat',
}

export const LOAN_STATUS_COLORS: Record<LoanStatusValue, string> = {
  dipinjam: 'blue',
  dikembalikan: 'green',
  terlambat: 'red',
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
