/**
 * File Constants - Menyimpan semua nilai tetap aplikasi
 * Memudahkan maintenance dan debugging
 */

// ============================================
// KONFIGURASI API
// ============================================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 detik
  RETRY_ATTEMPTS: 1,
} as const

// ============================================
// HTTP STATUS CODES
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// ============================================
// PESAN ERROR
// ============================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
  NOT_FOUND: 'Data yang Anda cari tidak ditemukan.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui.',
} as const

// ============================================
// PESAN SUKSES
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login berhasil! Selamat datang.',
  LOGOUT: 'Logout berhasil.',
  CREATE: 'Data berhasil ditambahkan.',
  UPDATE: 'Data berhasil diperbarui.',
  DELETE: 'Data berhasil dihapus.',
  UPLOAD: 'File berhasil diunggah.',
} as const

// ============================================
// QUERY KEYS (untuk React Query)
// ============================================
export const QUERY_KEYS = {
  ASSETS: 'assets',
  ASSET_DETAIL: 'asset-detail',
  CATEGORIES: 'categories',
  LOANS: 'loans',
  INVENTORY: 'inventory',
  DEPRECIATION: 'depreciation',
  AUDIT: 'audit',
  DASHBOARD: 'dashboard',
  USER_ACTIVITY: 'user-activity',
} as const

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const

// ============================================
// ROUTES
// ============================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ASSETS: '/assets',
  ASSETS_FAVORITES: '/assets/favorites',
  ASSETS_NEW: '/assets/new',
  ASSET_DETAIL: (id: string) => `/assets/${id}`,
  CATEGORIES: '/categories',
  LOANS: '/loans',
  LOANS_NEW: '/loans/new',
  INVENTORY: '/inventory',
  INVENTORY_SCAN: '/inventory/scan',
  DEPRECIATION: '/depreciation',
  REPORTS_KIB: '/reports/kib',
  AUDIT: '/audit',
  PROFILE_ACTIVITY: '/profile/activity',
} as const

// ============================================
// PAGINATION
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

// ============================================
// VALIDASI
// ============================================
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const

// ============================================
// DEBUG MODE
// ============================================
export const DEBUG_CONFIG = {
  ENABLED: import.meta.env.DEV,
  LOG_API_CALLS: true,
  LOG_STATE_CHANGES: true,
  LOG_ERRORS: true,
} as const

// ============================================
// DEMO USER (untuk mode tanpa backend)
// ============================================
export const DEMO_USER = {
  id: 'demo-user-001',
  name: 'Demo User',
  email: 'demo@simanis.com',
  role: 'admin',
  department: 'IT',
} as const
