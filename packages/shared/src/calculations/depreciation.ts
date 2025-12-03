/**
 * Depreciation Calculations
 * Perhitungan penyusutan aset menggunakan metode garis lurus
 * Sesuai standar akuntansi pemerintah Indonesia
 */

export interface DepreciationInput {
  /** Harga perolehan aset */
  hargaPerolehan: number
  /** Masa manfaat dalam tahun */
  masaManfaatTahun: number
  /** Tanggal perolehan aset */
  tanggalPerolehan: Date
  /** Tanggal perhitungan (default: sekarang) */
  tanggalHitung?: Date
}

export interface DepreciationResult {
  /** Nilai penyusutan per tahun */
  penyusutanPerTahun: number
  /** Total akumulasi penyusutan sampai tanggal hitung */
  akumulasiPenyusutan: number
  /** Nilai buku saat ini */
  nilaiBuku: number
  /** Umur aset dalam tahun (desimal) */
  umurAset: number
  /** Persentase penyusutan */
  persentasePenyusutan: number
  /** Apakah aset sudah habis masa manfaatnya */
  sudahHabis: boolean
}

/**
 * Menghitung penyusutan aset menggunakan metode garis lurus
 *
 * Formula:
 * - Penyusutan per tahun = Harga Perolehan / Masa Manfaat
 * - Akumulasi Penyusutan = Penyusutan per tahun × Umur Aset
 * - Nilai Buku = Harga Perolehan - Akumulasi Penyusutan
 *
 * @param input - Parameter perhitungan penyusutan
 * @returns Hasil perhitungan penyusutan
 */
export function calculateDepreciation(
  input: DepreciationInput
): DepreciationResult {
  const {
    hargaPerolehan,
    masaManfaatTahun,
    tanggalPerolehan,
    tanggalHitung = new Date(),
  } = input

  // Validasi input
  if (hargaPerolehan < 0) {
    throw new Error('Harga perolehan tidak boleh negatif')
  }
  if (masaManfaatTahun <= 0) {
    return {
      penyusutanPerTahun: 0,
      akumulasiPenyusutan: 0,
      nilaiBuku: hargaPerolehan,
      umurAset: 0,
      persentasePenyusutan: 0,
      sudahHabis: false,
    }
  }

  // Hitung umur aset dalam tahun (dengan desimal)
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000
  const umurAset = Math.max(
    0,
    (tanggalHitung.getTime() - tanggalPerolehan.getTime()) / msPerYear
  )

  // Hitung penyusutan per tahun
  const penyusutanPerTahun = hargaPerolehan / masaManfaatTahun

  // Hitung akumulasi penyusutan (tidak melebihi harga perolehan)
  const akumulasiPenyusutan = Math.min(
    penyusutanPerTahun * umurAset,
    hargaPerolehan
  )

  // Hitung nilai buku
  const nilaiBuku = Math.max(0, hargaPerolehan - akumulasiPenyusutan)

  // Hitung persentase penyusutan
  const persentasePenyusutan =
    hargaPerolehan > 0 ? (akumulasiPenyusutan / hargaPerolehan) * 100 : 0

  // Cek apakah sudah habis masa manfaat
  const sudahHabis = umurAset >= masaManfaatTahun

  return {
    penyusutanPerTahun: Math.round(penyusutanPerTahun),
    akumulasiPenyusutan: Math.round(akumulasiPenyusutan),
    nilaiBuku: Math.round(nilaiBuku),
    umurAset: Math.round(umurAset * 100) / 100, // 2 desimal
    persentasePenyusutan: Math.round(persentasePenyusutan * 100) / 100,
    sudahHabis,
  }
}

/**
 * Format nilai rupiah
 * @param value - Nilai dalam rupiah
 * @returns String terformat (contoh: "Rp 1.500.000")
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Hitung proyeksi nilai buku untuk beberapa tahun ke depan
 * @param input - Parameter perhitungan
 * @param years - Jumlah tahun proyeksi
 * @returns Array proyeksi nilai buku per tahun
 */
export function projectDepreciation(
  input: DepreciationInput,
  years: number
): Array<{ tahun: number; nilaiBuku: number; akumulasiPenyusutan: number }> {
  const projections: Array<{
    tahun: number
    nilaiBuku: number
    akumulasiPenyusutan: number
  }> = []

  const baseDate = input.tanggalHitung || new Date()

  for (let i = 0; i <= years; i++) {
    const tanggalHitung = new Date(baseDate)
    tanggalHitung.setFullYear(tanggalHitung.getFullYear() + i)

    const result = calculateDepreciation({
      ...input,
      tanggalHitung,
    })

    projections.push({
      tahun: tanggalHitung.getFullYear(),
      nilaiBuku: result.nilaiBuku,
      akumulasiPenyusutan: result.akumulasiPenyusutan,
    })
  }

  return projections
}
