/**
 * =====================================================
 * TYPES - Inventory Check (Inventarisasi)
 * =====================================================
 *
 * Type definitions untuk fitur inventarisasi aset
 * Terintegrasi dengan Asset Management
 *
 * @author SIMANIS Team
 * @version 1.0.0
 */

import type { KondisiAset, StatusSesiInventarisasi } from '../constants'

// ============================================================
// SESI INVENTARISASI
// ============================================================

/**
 * Sesi Inventarisasi
 * Mewakili satu sesi stock opname di lokasi tertentu
 */
export interface SesiInventarisasi {
  /** ID unik sesi */
  id: number
  /** ID lokasi yang diinventarisasi */
  lokasiId: number
  /** Nama lokasi (untuk display) */
  lokasiNama: string
  /** ID petugas yang melakukan inventarisasi */
  petugasId: number
  /** Nama petugas (untuk display) */
  petugasNama: string
  /** Catatan opsional tentang sesi */
  catatan?: string
  /** Status sesi: berlangsung/selesai/dibatalkan */
  status: StatusSesiInventarisasi
  /** Tanggal dan waktu sesi dimulai */
  tanggalMulai: string // ISO datetime
  /** Tanggal dan waktu sesi selesai (jika sudah) */
  tanggalSelesai?: string // ISO datetime
  /** Total aset di lokasi saat sesi dimulai */
  totalAset: number
  /** Jumlah aset yang sudah dicek */
  totalDicek: number
  /** Jumlah aset bermasalah (kondisi berubah/hilang) */
  totalBermasalah: number
}

/**
 * Data untuk membuat sesi baru
 */
export interface BuatSesiBaru {
  /** ID lokasi yang akan diinventarisasi */
  lokasiId: number
  /** Catatan opsional */
  catatan?: string
}

// ============================================================
// HASIL PENGECEKAN ASET
// ============================================================

/**
 * Hasil Pengecekan Aset
 * Mewakili satu aset yang sudah dicek dalam sesi
 */
export interface HasilPengecekan {
  /** ID unik hasil pengecekan */
  id: number
  /** ID sesi inventarisasi */
  sessionId: number
  /** ID aset yang dicek */
  assetId: number
  /** Kode aset (untuk display) */
  kodeAset: string
  /** Nama barang (untuk display) */
  namaBarang: string
  /** Kondisi aset SEBELUM dicek (dari database) */
  kondisiSebelum: KondisiAset
  /** Kondisi aset SESUDAH dicek (dari input petugas) */
  kondisiSesudah: KondisiAset
  /** Apakah kondisi berubah dari sebelumnya */
  kondisiBerubah: boolean
  /** Catatan dari petugas */
  catatan?: string
  /** URL foto bukti (jika diupload) */
  fotoBukti?: string
  /** Waktu pengecekan */
  dicekPada: string // ISO datetime
}

/**
 * Data untuk melakukan pengecekan aset
 */
export interface CekAsetRequest {
  /** Kode aset (dari QR scan) */
  kodeAset: string
  /** Kondisi aset saat ini */
  kondisi: KondisiAset
  /** Catatan opsional */
  catatan?: string
  /** File foto bukti (opsional) */
  fotoBukti?: File
}

// ============================================================
// RINGKASAN SESI
// ============================================================

/**
 * Ringkasan Sesi Inventarisasi
 * Ditampilkan saat akan menyelesaikan sesi
 */
export interface RingkasanSesi {
  /** Total aset yang terdaftar di lokasi */
  totalAsetDiLokasi: number
  /** Total aset yang sudah dicek */
  totalDicek: number
  /** Total aset yang belum dicek */
  totalBelumDicek: number
  /** Total aset yang kondisinya berubah */
  totalKondisiBerubah: number
  /** Total aset yang hilang */
  totalHilang: number
  /** Daftar aset yang belum dicek */
  daftarBelumDicek: AsetBelumDicek[]
  /** Daftar aset yang kondisinya berubah */
  daftarKondisiBerubah: HasilPengecekan[]
}

/**
 * Info aset yang belum dicek
 */
export interface AsetBelumDicek {
  id: number
  kodeAset: string
  namaBarang: string
  kondisiTerakhir: KondisiAset
}

// ============================================================
// INFO ASET (untuk display setelah scan)
// ============================================================

/**
 * Info aset yang ditampilkan setelah QR di-scan
 */
export interface InfoAset {
  id: number
  kodeAset: string
  namaBarang: string
  kategori: string
  lokasi: string
  kondisiTerakhir: KondisiAset
  nilaiPerolehan: number
  tanggalPerolehan: string
  fotoUrl?: string
}

// ============================================================
// LOKASI
// ============================================================

/**
 * Lokasi untuk inventarisasi
 */
export interface Lokasi {
  id: number
  nama: string
  /** Nama gedung */
  gedung?: string
  /** Lantai */
  lantai?: string
  /** Nama ruangan */
  ruangan?: string
  /** Jumlah aset di lokasi ini */
  jumlahAset: number
}

// ============================================================
// FILTER & PAGINATION
// ============================================================

/**
 * Filter untuk daftar sesi inventarisasi
 */
export interface FilterSesiInventarisasi {
  /** Filter berdasarkan lokasi */
  lokasiId?: number
  /** Filter berdasarkan status */
  status?: StatusSesiInventarisasi
  /** Filter berdasarkan tanggal mulai (dari) */
  tanggalMulai?: string // YYYY-MM-DD
  /** Filter berdasarkan tanggal mulai (sampai) */
  tanggalSelesai?: string // YYYY-MM-DD
  /** Halaman */
  page?: number
  /** Jumlah per halaman */
  pageSize?: number
}

/**
 * Response dengan pagination
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// ============================================================
// LAPORAN
// ============================================================

/**
 * Parameter untuk generate laporan
 */
export interface LaporanParams {
  /** Format laporan */
  format: 'pdf' | 'excel'
}

/**
 * Detail sesi untuk halaman laporan
 */
export interface DetailSesiInventarisasi {
  /** Info sesi */
  sesi: SesiInventarisasi
  /** Daftar aset yang sudah dicek */
  hasilPengecekan: HasilPengecekan[]
  /** Ringkasan statistik */
  ringkasan: RingkasanSesi
}
