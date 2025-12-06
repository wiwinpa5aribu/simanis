/**
 * =====================================================
 * SHARED CONSTANTS - Konstanta Bersama SIMANIS
 * =====================================================
 *
 * File ini berisi konstanta yang digunakan di SELURUH aplikasi
 * untuk menjaga KONSISTENSI antara:
 * - Asset Management
 * - Depreciation (Penyusutan)
 * - Inventory Check (Inventarisasi)
 *
 * PENTING: Jika mengubah nilai di sini, pastikan database
 * dan backend juga diupdate agar tetap sinkron!
 *
 * @author SIMANIS Team
 * @version 1.0.0
 */

// ============================================================
// KONDISI ASET
// ============================================================

/**
 * Nilai kondisi aset yang valid
 * Digunakan di: Asset Management, Inventory Check, Depreciation
 */
export const KONDISI_ASET = {
  /** Aset dalam kondisi baik, berfungsi normal */
  BAIK: 'baik',
  /** Aset rusak ringan, masih bisa digunakan */
  RUSAK_RINGAN: 'rusak_ringan',
  /** Aset rusak berat, tidak bisa digunakan */
  RUSAK_BERAT: 'rusak_berat',
  /** Aset hilang (khusus Inventory Check) */
  HILANG: 'hilang',
} as const

export type KondisiAset = (typeof KONDISI_ASET)[keyof typeof KONDISI_ASET]

/**
 * Kondisi yang valid untuk Asset Management (tanpa 'hilang')
 */
export const KONDISI_ASET_STANDAR = [
  KONDISI_ASET.BAIK,
  KONDISI_ASET.RUSAK_RINGAN,
  KONDISI_ASET.RUSAK_BERAT,
] as const

/**
 * Kondisi yang valid untuk Inventory Check (termasuk 'hilang')
 */
export const KONDISI_ASET_INVENTARISASI = [
  KONDISI_ASET.BAIK,
  KONDISI_ASET.RUSAK_RINGAN,
  KONDISI_ASET.RUSAK_BERAT,
  KONDISI_ASET.HILANG,
] as const

/**
 * Label kondisi dalam Bahasa Indonesia untuk ditampilkan di UI
 */
export const KONDISI_ASET_LABEL: Record<KondisiAset, string> = {
  [KONDISI_ASET.BAIK]: 'Baik',
  [KONDISI_ASET.RUSAK_RINGAN]: 'Rusak Ringan',
  [KONDISI_ASET.RUSAK_BERAT]: 'Rusak Berat',
  [KONDISI_ASET.HILANG]: 'Hilang',
}

/**
 * Warna badge (Tailwind CSS classes) untuk setiap kondisi
 */
export const KONDISI_ASET_WARNA: Record<KondisiAset, string> = {
  [KONDISI_ASET.BAIK]: 'bg-green-100 text-green-800 border-green-200',
  [KONDISI_ASET.RUSAK_RINGAN]:
    'bg-yellow-100 text-yellow-800 border-yellow-200',
  [KONDISI_ASET.RUSAK_BERAT]: 'bg-orange-100 text-orange-800 border-orange-200',
  [KONDISI_ASET.HILANG]: 'bg-red-100 text-red-800 border-red-200',
}

/**
 * Icon untuk setiap kondisi (nama icon Lucide)
 */
export const KONDISI_ASET_ICON: Record<KondisiAset, string> = {
  [KONDISI_ASET.BAIK]: 'CheckCircle',
  [KONDISI_ASET.RUSAK_RINGAN]: 'AlertTriangle',
  [KONDISI_ASET.RUSAK_BERAT]: 'XCircle',
  [KONDISI_ASET.HILANG]: 'Search',
}

// ============================================================
// KATEGORI ASET
// ============================================================

/**
 * Kategori aset dengan default masa manfaat untuk penyusutan
 * Nilai defaultMasaManfaat dalam TAHUN
 */
export const KATEGORI_ASET = [
  { id: 1, kode: 'ELK', nama: 'Elektronik', defaultMasaManfaat: 4 },
  { id: 2, kode: 'FRN', nama: 'Furniture', defaultMasaManfaat: 8 },
  { id: 3, kode: 'KDR', nama: 'Kendaraan', defaultMasaManfaat: 10 },
  { id: 4, kode: 'PRL', nama: 'Peralatan', defaultMasaManfaat: 5 },
  { id: 5, kode: 'BGN', nama: 'Bangunan', defaultMasaManfaat: 20 },
  { id: 6, kode: 'OLR', nama: 'Olahraga', defaultMasaManfaat: 5 },
  { id: 7, kode: 'SNI', nama: 'Seni', defaultMasaManfaat: 10 },
  { id: 8, kode: 'BKU', nama: 'Buku', defaultMasaManfaat: 4 },
] as const

export type KategoriAsetKode = (typeof KATEGORI_ASET)[number]['kode']

// ============================================================
// FORMAT KODE ASET
// ============================================================

/**
 * Pattern kode aset yang valid
 * Format: SCH/YYYY/CATEGORY_CODE/SEQUENCE
 * Contoh: SCH/2025/ELK/0001
 */
export const KODE_ASET_PATTERN = /^SCH\/\d{4}\/[A-Z]{3}\/\d{4}$/

/**
 * Prefix untuk kode aset (nama sekolah)
 */
export const KODE_ASET_PREFIX = 'SCH'

/**
 * Fungsi untuk generate kode aset baru
 */
export function generateKodeAset(
  tahun: number,
  kategoriKode: string,
  urutan: number
): string {
  const urutanPadded = urutan.toString().padStart(4, '0')
  return `${KODE_ASET_PREFIX}/${tahun}/${kategoriKode}/${urutanPadded}`
}

/**
 * Fungsi untuk validasi kode aset
 */
export function isKodeAsetValid(kode: string): boolean {
  return KODE_ASET_PATTERN.test(kode)
}

/**
 * Fungsi untuk parse kode aset
 */
export function parseKodeAset(kode: string): {
  prefix: string
  tahun: number
  kategori: string
  urutan: number
} | null {
  if (!isKodeAsetValid(kode)) return null

  const parts = kode.split('/')
  return {
    prefix: parts[0],
    tahun: parseInt(parts[1], 10),
    kategori: parts[2],
    urutan: parseInt(parts[3], 10),
  }
}

// ============================================================
// STATUS SESI INVENTARISASI
// ============================================================

export const STATUS_SESI_INVENTARISASI = {
  /** Sesi sedang berlangsung */
  BERLANGSUNG: 'berlangsung',
  /** Sesi sudah selesai */
  SELESAI: 'selesai',
  /** Sesi dibatalkan */
  DIBATALKAN: 'dibatalkan',
} as const

export type StatusSesiInventarisasi =
  (typeof STATUS_SESI_INVENTARISASI)[keyof typeof STATUS_SESI_INVENTARISASI]

export const STATUS_SESI_LABEL: Record<StatusSesiInventarisasi, string> = {
  [STATUS_SESI_INVENTARISASI.BERLANGSUNG]: 'Berlangsung',
  [STATUS_SESI_INVENTARISASI.SELESAI]: 'Selesai',
  [STATUS_SESI_INVENTARISASI.DIBATALKAN]: 'Dibatalkan',
}

export const STATUS_SESI_WARNA: Record<StatusSesiInventarisasi, string> = {
  [STATUS_SESI_INVENTARISASI.BERLANGSUNG]: 'bg-blue-100 text-blue-800',
  [STATUS_SESI_INVENTARISASI.SELESAI]: 'bg-green-100 text-green-800',
  [STATUS_SESI_INVENTARISASI.DIBATALKAN]: 'bg-gray-100 text-gray-800',
}

// ============================================================
// UPLOAD FILE
// ============================================================

/**
 * Konfigurasi upload foto
 */
export const FOTO_CONFIG = {
  /** Ukuran maksimal dalam bytes (5MB) */
  MAX_SIZE: 5 * 1024 * 1024,
  /** Format yang diizinkan */
  ALLOWED_TYPES: ['image/jpeg', 'image/png'],
  /** Extension yang diizinkan */
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
}

/**
 * Validasi file foto
 */
export function isValidFoto(file: File): {
  valid: boolean
  error?: string
} {
  if (file.size > FOTO_CONFIG.MAX_SIZE) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal (${FOTO_CONFIG.MAX_SIZE / 1024 / 1024}MB)`,
    }
  }

  if (!FOTO_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file harus JPG atau PNG',
    }
  }

  return { valid: true }
}

// ============================================================
// PAGINATION
// ============================================================

export const PAGINATION_DEFAULT = {
  PAGE: 1,
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// ============================================================
// ROUTES
// ============================================================

/**
 * Route definitions untuk konsistensi navigasi
 */
export const ROUTES = {
  // Dashboard
  DASHBOARD: '/',

  // Asset Management
  ASSETS: {
    LIST: '/assets',
    CREATE: '/assets/new', // BUKAN /assets/create (lihat BUG-001)
    DETAIL: (id: number) => `/assets/${id}`,
    EDIT: (id: number) => `/assets/${id}/edit`,
  },

  // Depreciation
  DEPRECIATION: {
    MAIN: '/depreciation',
    WITH_TAB: (tab: 'dashboard' | 'list' | 'simulation' | 'settings') =>
      `/depreciation?tab=${tab}`,
  },

  // Inventory Check
  INVENTORY: {
    LIST: '/inventory',
    CREATE: '/inventory/new',
    SESSION: (id: number) => `/inventory/session/${id}`,
    SCAN: (sessionId: number) => `/inventory/session/${sessionId}/scan`,
    REPORT: (id: number) => `/inventory/session/${id}/report`,
  },
} as const

// ============================================================
// ROLE-BASED ACCESS
// ============================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  WAKASEK: 'wakasek',
  OPERATOR: 'operator',
  GURU: 'guru',
  BENDAHARA: 'bendahara',
  KEPSEK: 'kepsek',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/**
 * Fitur yang bisa diakses per role
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['all'],
  [USER_ROLES.WAKASEK]: [
    'assets.view',
    'assets.create',
    'assets.edit',
    'assets.delete',
    'depreciation.view',
    'inventory.view',
    'inventory.manage',
  ],
  [USER_ROLES.OPERATOR]: [
    'assets.view',
    'assets.create',
    'assets.edit',
    'inventory.view',
    'inventory.manage',
    'inventory.scan',
  ],
  [USER_ROLES.GURU]: ['assets.view', 'loans.request'],
  [USER_ROLES.BENDAHARA]: [
    'assets.view',
    'depreciation.view',
    'depreciation.report',
  ],
  [USER_ROLES.KEPSEK]: ['all.view', 'reports.view'],
} as const
