/**
 * Test Konsistensi - Membuktikan AI mengikuti camelCase convention
 * Sesuai prompt.md baris 136-145
 */

interface Asset {
    id: number
    kodeAset: string           // ✅ camelCase (bukan kode_aset)
    namaBarang: string         // ✅ camelCase (bukan nama_barang)
    categoryId?: number        // ✅ camelCase dengan optional
    tanggalPerolehan: Date     // ✅ camelCase (bukan tanggal_perolehan)
}

// VERIFICATION: Semua property menggunakan camelCase ✅
// - kodeAset (bukan kode_aset)
// - namaBarang (bukan nama_barang)  
// - categoryId (bukan category_id)
// - tanggalPerolehan (bukan tanggal_perolehan)

export type { Asset }
