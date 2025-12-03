/**
 * Depreciation Calculator Service
 *
 * Implements straight-line depreciation method (Metode Garis Lurus)
 * according to BMN (Barang Milik Negara) standards
 */
export class DepreciationCalculatorService {
  /**
   * Calculate monthly depreciation amount
   * Formula: Penyusutan Bulanan = Nilai Perolehan / (Masa Manfaat × 12)
   *
   * @param nilaiPerolehan - Asset acquisition value (harga)
   * @param masaManfaatTahun - Useful life in years
   * @returns Monthly depreciation amount
   */
  calculateMonthlyDepreciation(
    nilaiPerolehan: number,
    masaManfaatTahun: number
  ): number {
    if (masaManfaatTahun <= 0) {
      throw new Error('Masa manfaat harus lebih dari 0')
    }

    if (nilaiPerolehan < 0) {
      throw new Error('Nilai perolehan tidak boleh negatif')
    }

    const totalBulan = masaManfaatTahun * 12
    return nilaiPerolehan / totalBulan
  }

  /**
   * Calculate current book value
   * Formula: Nilai Buku = Nilai Perolehan - Akumulasi Penyusutan
   *
   * @param nilaiPerolehan - Asset acquisition value
   * @param akumulasiPenyusutan - Accumulated depreciation
   * @returns Current book value (minimum 0)
   */
  calculateBookValue(
    nilaiPerolehan: number,
    akumulasiPenyusutan: number
  ): number {
    if (nilaiPerolehan < 0) {
      throw new Error('Nilai perolehan tidak boleh negatif')
    }

    if (akumulasiPenyusutan < 0) {
      throw new Error('Akumulasi penyusutan tidak boleh negatif')
    }

    const bookValue = nilaiPerolehan - akumulasiPenyusutan

    // Book value should never be negative
    return Math.max(0, bookValue)
  }

  /**
   * Calculate accumulated depreciation up to a specific month
   *
   * @param nilaiPerolehan - Asset acquisition value
   * @param masaManfaatTahun - Useful life in years
   * @param bulanBerjalan - Number of months elapsed
   * @returns Accumulated depreciation amount
   */
  calculateAccumulatedDepreciation(
    nilaiPerolehan: number,
    masaManfaatTahun: number,
    bulanBerjalan: number
  ): number {
    const monthlyDepreciation = this.calculateMonthlyDepreciation(
      nilaiPerolehan,
      masaManfaatTahun
    )

    const accumulated = monthlyDepreciation * bulanBerjalan

    // Accumulated depreciation should not exceed acquisition value
    return Math.min(accumulated, nilaiPerolehan)
  }

  /**
   * Check if asset is fully depreciated
   *
   * @param nilaiBuku - Current book value
   * @returns True if book value is 0
   */
  isFullyDepreciated(nilaiBuku: number): boolean {
    return nilaiBuku <= 0
  }

  /**
   * Calculate remaining useful life in months
   *
   * @param nilaiPerolehan - Asset acquisition value
   * @param akumulasiPenyusutan - Accumulated depreciation
   * @param masaManfaatTahun - Total useful life in years
   * @returns Remaining months (0 if fully depreciated)
   */
  calculateRemainingLife(
    nilaiPerolehan: number,
    akumulasiPenyusutan: number,
    masaManfaatTahun: number
  ): number {
    const nilaiBuku = this.calculateBookValue(
      nilaiPerolehan,
      akumulasiPenyusutan
    )

    if (this.isFullyDepreciated(nilaiBuku)) {
      return 0
    }

    const monthlyDepreciation = this.calculateMonthlyDepreciation(
      nilaiPerolehan,
      masaManfaatTahun
    )

    const remainingMonths = Math.ceil(nilaiBuku / monthlyDepreciation)
    return remainingMonths
  }
}
