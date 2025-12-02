/**
 * Asset Code Generator
 * Utilitas untuk generate dan validasi kode aset
 * Format: [KATEGORI]-[TAHUN]-[SEQUENCE]
 * Contoh: ELK-2024-0001
 */

export interface AssetCodeConfig {
  /** Prefix kategori (3 huruf) */
  categoryPrefix: string
  /** Tahun perolehan */
  year: number
  /** Nomor urut */
  sequence: number
  /** Panjang sequence (default: 4) */
  sequenceLength?: number
}

export interface AssetCodeParts {
  categoryPrefix: string
  year: number
  sequence: number
}

/**
 * Generate kode aset berdasarkan konfigurasi
 * @param config - Konfigurasi kode aset
 * @returns Kode aset terformat
 *
 * @example
 * generateAssetCode({ categoryPrefix: 'ELK', year: 2024, sequence: 1 })
 * // Returns: 'ELK-2024-0001'
 */
export function generateAssetCode(config: AssetCodeConfig): string {
  const { categoryPrefix, year, sequence, sequenceLength = 4 } = config

  // Validasi
  if (
    !categoryPrefix ||
    categoryPrefix.length < 2 ||
    categoryPrefix.length > 5
  ) {
    throw new Error('Category prefix harus 2-5 karakter')
  }
  if (year < 1900 || year > 2100) {
    throw new Error('Tahun tidak valid')
  }
  if (sequence < 1) {
    throw new Error('Sequence harus minimal 1')
  }

  const prefix = categoryPrefix.toUpperCase()
  const seq = sequence.toString().padStart(sequenceLength, '0')

  return `${prefix}-${year}-${seq}`
}

/**
 * Parse kode aset menjadi komponen-komponennya
 * @param code - Kode aset
 * @returns Komponen kode aset atau null jika tidak valid
 *
 * @example
 * parseAssetCode('ELK-2024-0001')
 * // Returns: { categoryPrefix: 'ELK', year: 2024, sequence: 1 }
 */
export function parseAssetCode(code: string): AssetCodeParts | null {
  const pattern = /^([A-Z]{2,5})-(\d{4})-(\d+)$/
  const match = code.toUpperCase().match(pattern)

  if (!match) {
    return null
  }

  return {
    categoryPrefix: match[1],
    year: parseInt(match[2], 10),
    sequence: parseInt(match[3], 10),
  }
}

/**
 * Validasi format kode aset
 * @param code - Kode aset
 * @returns true jika valid
 */
export function isValidAssetCode(code: string): boolean {
  return parseAssetCode(code) !== null
}

/**
 * Generate kode aset berikutnya berdasarkan kode terakhir
 * @param lastCode - Kode aset terakhir (atau null jika belum ada)
 * @param categoryPrefix - Prefix kategori
 * @param year - Tahun (default: tahun sekarang)
 * @returns Kode aset berikutnya
 *
 * @example
 * getNextAssetCode('ELK-2024-0005', 'ELK')
 * // Returns: 'ELK-2024-0006'
 *
 * getNextAssetCode(null, 'FRN', 2024)
 * // Returns: 'FRN-2024-0001'
 */
export function getNextAssetCode(
  lastCode: string | null,
  categoryPrefix: string,
  year: number = new Date().getFullYear()
): string {
  if (!lastCode) {
    return generateAssetCode({ categoryPrefix, year, sequence: 1 })
  }

  const parts = parseAssetCode(lastCode)

  if (!parts) {
    return generateAssetCode({ categoryPrefix, year, sequence: 1 })
  }

  // Jika tahun berbeda, mulai dari 1
  if (parts.year !== year) {
    return generateAssetCode({ categoryPrefix, year, sequence: 1 })
  }

  // Increment sequence
  return generateAssetCode({
    categoryPrefix,
    year,
    sequence: parts.sequence + 1,
  })
}

/**
 * Mapping kategori ke prefix
 * Bisa di-extend sesuai kebutuhan
 */
export const CATEGORY_PREFIXES: Record<string, string> = {
  Elektronik: 'ELK',
  Furniture: 'FRN',
  Buku: 'BKU',
  'Alat Olahraga': 'OLR',
  Kendaraan: 'KND',
  'Alat Laboratorium': 'LAB',
  'Alat Musik': 'MSK',
  'Peralatan Kantor': 'KNT',
}

/**
 * Get prefix dari nama kategori
 * @param categoryName - Nama kategori
 * @returns Prefix atau 3 huruf pertama jika tidak ditemukan
 */
export function getCategoryPrefix(categoryName: string): string {
  const prefix = CATEGORY_PREFIXES[categoryName]
  if (prefix) {
    return prefix
  }

  // Fallback: ambil 3 huruf pertama dan uppercase
  return categoryName
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, 'X')
}
