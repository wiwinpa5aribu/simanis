/**
 * =====================================================
 * API - Inventory Check (Inventarisasi) - SESI
 * =====================================================
 *
 * API functions untuk mengelola sesi inventarisasi
 * Menggunakan pola yang konsisten dengan API lainnya
 *
 * Integrasi dengan:
 * - Asset Management (mengambil data aset)
 * - Audit Trail (mencatat aktivitas)
 *
 * @author SIMANIS Team
 * @version 2.0.0
 */

import { z } from 'zod'
import type {
  DetailSesiInventarisasi,
  FilterSesiInventarisasi,
  HasilPengecekan,
  InfoAset,
  Lokasi,
  PaginatedResponse,
  RingkasanSesi,
  SesiInventarisasi,
} from '../types'
import { getErrorMessage } from '../utils/errorHandling'
import { logger } from '../utils/logger'
import type {
  BuatSesiBaruInput,
  CekAsetDenganFotoInput,
} from '../validation/inventorySchemas'
import { api } from './client'

// ============================================================
// ERROR MESSAGES
// ============================================================

/**
 * Pesan error dalam Bahasa Indonesia
 */
export const INVENTORY_ERROR_MESSAGES = {
  SESI_TIDAK_DITEMUKAN: 'Sesi inventarisasi tidak ditemukan',
  SESI_SUDAH_SELESAI: 'Sesi inventarisasi sudah selesai',
  ASET_TIDAK_DITEMUKAN: 'Aset tidak ditemukan dalam database',
  ASET_SUDAH_DICEK: 'Aset sudah dicek dalam sesi ini',
  ASET_BUKAN_DI_LOKASI: 'Aset tidak berada di lokasi inventarisasi',
  KODE_QR_TIDAK_VALID: 'Format kode QR tidak valid',
  GAGAL_UPLOAD_FOTO: 'Gagal mengupload foto bukti',
  GAGAL_MEMBUAT_SESI: 'Gagal membuat sesi inventarisasi baru',
  GAGAL_MENYELESAIKAN: 'Gagal menyelesaikan sesi inventarisasi',
  SERVER_ERROR: 'Terjadi kesalahan pada server',
} as const

// ============================================================
// ZOD SCHEMAS FOR RESPONSE VALIDATION
// ============================================================

const sesiSchema = z.object({
  id: z.number(),
  lokasiId: z.number(),
  lokasiNama: z.string(),
  petugasId: z.number(),
  petugasNama: z.string(),
  catatan: z.string().optional(),
  status: z.enum(['berlangsung', 'selesai', 'dibatalkan']),
  tanggalMulai: z.string(),
  tanggalSelesai: z.string().optional(),
  totalAset: z.number(),
  totalDicek: z.number(),
  totalBermasalah: z.number(),
})

const hasilPengecekanSchema = z.object({
  id: z.number(),
  sessionId: z.number(),
  assetId: z.number(),
  kodeAset: z.string(),
  namaBarang: z.string(),
  kondisiSebelum: z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'hilang']),
  kondisiSesudah: z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'hilang']),
  kondisiBerubah: z.boolean(),
  catatan: z.string().optional(),
  fotoBukti: z.string().optional(),
  dicekPada: z.string(),
})

// ============================================================
// API FUNCTIONS: SESI INVENTARISASI
// ============================================================

/**
 * Mengambil daftar sesi inventarisasi dengan filter dan pagination
 *
 * @param params - Parameter filter (lokasi, status, tanggal, pagination)
 * @returns Daftar sesi dengan metadata pagination
 *
 * @example
 * const { data, meta } = await getDaftarSesi({ lokasiId: 1, status: 'selesai' })
 */
export async function getDaftarSesi(
  params: FilterSesiInventarisasi = {}
): Promise<PaginatedResponse<SesiInventarisasi>> {
  try {
    logger.info('Inventory API', 'Mengambil daftar sesi inventarisasi', {
      params,
    })

    const response = await api.get<SesiInventarisasi[]>('/inventory/sessions', {
      params: {
        lokasiId: params.lokasiId,
        status: params.status,
        tanggalMulai: params.tanggalMulai,
        tanggalSelesai: params.tanggalSelesai,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      },
    })

    // Validasi response
    const parsed = z.array(sesiSchema).safeParse(response.data)
    if (!parsed.success) {
      logger.error('Inventory API', 'Response tidak valid', undefined, {
        issues: parsed.error.issues,
      })
      throw new Error(INVENTORY_ERROR_MESSAGES.SERVER_ERROR)
    }

    const meta = (
      response as {
        meta?: {
          page: number
          pageSize: number
          total: number
          totalPages: number
        }
      }
    ).meta ?? {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    }

    logger.success(
      'Inventory API',
      `Berhasil mengambil ${parsed.data.length} sesi inventarisasi`
    )

    return { data: parsed.data, meta }
  } catch (error) {
    logger.error('Inventory API', 'Gagal mengambil daftar sesi', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SERVER_ERROR
    )
  }
}

/**
 * Mengambil detail sesi inventarisasi beserta hasil pengecekan
 *
 * @param id - ID sesi inventarisasi
 * @returns Detail sesi lengkap dengan daftar hasil pengecekan
 */
export async function getDetailSesi(
  id: number
): Promise<DetailSesiInventarisasi> {
  try {
    logger.info('Inventory API', `Mengambil detail sesi ID: ${id}`)

    const response = await api.get<DetailSesiInventarisasi>(
      `/inventory/sessions/${id}`
    )

    logger.success('Inventory API', `Berhasil mengambil detail sesi ID: ${id}`)
    return response.data
  } catch (error) {
    logger.error(
      'Inventory API',
      `Gagal mengambil detail sesi ID: ${id}`,
      error
    )
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SESI_TIDAK_DITEMUKAN
    )
  }
}

/**
 * Membuat sesi inventarisasi baru
 *
 * @param data - Data sesi baru (lokasiId, catatan)
 * @returns Sesi yang baru dibuat
 *
 * @example
 * const sesi = await buatSesiBaru({ lokasiId: 1, catatan: 'Inventarisasi rutin' })
 */
export async function buatSesiBaru(
  data: BuatSesiBaruInput
): Promise<SesiInventarisasi> {
  try {
    logger.info('Inventory API', 'Membuat sesi inventarisasi baru', { data })

    const response = await api.post<SesiInventarisasi>(
      '/inventory/sessions',
      data
    )

    const parsed = sesiSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('Inventory API', 'Response create tidak valid', undefined, {
        errors: parsed.error.errors,
      })
      throw new Error(INVENTORY_ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success('Inventory API', 'Berhasil membuat sesi baru', {
      id: parsed.data.id,
      lokasi: parsed.data.lokasiNama,
    })

    return parsed.data
  } catch (error) {
    logger.error('Inventory API', 'Gagal membuat sesi baru', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.GAGAL_MEMBUAT_SESI
    )
  }
}

// ============================================================
// API FUNCTIONS: PENGECEKAN ASET
// ============================================================

/**
 * Mencari aset berdasarkan kode (dari QR scan)
 *
 * @param kodeAset - Kode aset dari hasil scan QR
 * @returns Info aset jika ditemukan
 */
export async function cariAsetByKode(kodeAset: string): Promise<InfoAset> {
  try {
    logger.info('Inventory API', `Mencari aset dengan kode: ${kodeAset}`)

    const response = await api.get<InfoAset>('/assets/by-code', {
      params: { kode: kodeAset },
    })

    logger.success(
      'Inventory API',
      `Aset ditemukan: ${response.data.namaBarang}`
    )
    return response.data
  } catch (error) {
    logger.error('Inventory API', `Aset tidak ditemukan: ${kodeAset}`, error)
    throw new Error(INVENTORY_ERROR_MESSAGES.ASET_TIDAK_DITEMUKAN)
  }
}

/**
 * Memeriksa apakah aset sudah dicek dalam sesi
 *
 * @param sessionId - ID sesi inventarisasi
 * @param assetId - ID aset
 * @returns true jika sudah dicek, false jika belum
 */
export async function cekAsetSudahDicek(
  sessionId: number,
  assetId: number
): Promise<boolean> {
  try {
    const response = await api.get<{ sudahDicek: boolean }>(
      `/inventory/sessions/${sessionId}/check-status`,
      { params: { assetId } }
    )
    return response.data.sudahDicek
  } catch {
    return false
  }
}

/**
 * Melakukan pengecekan aset dalam sesi inventarisasi
 *
 * @param sessionId - ID sesi inventarisasi
 * @param data - Data pengecekan (kodeAset, kondisi, catatan, foto)
 * @returns Hasil pengecekan yang tersimpan
 */
export async function cekAset(
  sessionId: number,
  data: CekAsetDenganFotoInput
): Promise<HasilPengecekan> {
  try {
    logger.info('Inventory API', 'Melakukan pengecekan aset', {
      sessionId,
      kodeAset: data.kodeAset,
      kondisi: data.kondisi,
    })

    // Gunakan FormData jika ada foto
    const formData = new FormData()
    formData.append('kodeAset', data.kodeAset)
    formData.append('kondisi', data.kondisi)
    if (data.catatan) formData.append('catatan', data.catatan)
    if (data.fotoBukti) formData.append('fotoBukti', data.fotoBukti)

    const response = await api.post<HasilPengecekan>(
      `/inventory/sessions/${sessionId}/check`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    const parsed = hasilPengecekanSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('Inventory API', 'Response check tidak valid', undefined, {
        errors: parsed.error.errors,
      })
      throw new Error(INVENTORY_ERROR_MESSAGES.SERVER_ERROR)
    }

    logger.success('Inventory API', 'Pengecekan aset berhasil', {
      assetId: parsed.data.assetId,
      kondisiBerubah: parsed.data.kondisiBerubah,
    })

    return parsed.data
  } catch (error) {
    const message = getErrorMessage(error)
    logger.error('Inventory API', 'Gagal melakukan pengecekan aset', error)

    // Handle specific errors
    if (message?.includes('sudah dicek')) {
      throw new Error(INVENTORY_ERROR_MESSAGES.ASET_SUDAH_DICEK)
    }
    if (message?.includes('tidak ditemukan')) {
      throw new Error(INVENTORY_ERROR_MESSAGES.ASET_TIDAK_DITEMUKAN)
    }

    throw new Error(message || INVENTORY_ERROR_MESSAGES.SERVER_ERROR)
  }
}

// ============================================================
// API FUNCTIONS: SELESAIKAN SESI
// ============================================================

/**
 * Mengambil ringkasan sesi sebelum diselesaikan
 *
 * @param sessionId - ID sesi inventarisasi
 * @returns Ringkasan sesi (total, dicek, belum dicek, bermasalah)
 */
export async function getRingkasanSesi(
  sessionId: number
): Promise<RingkasanSesi> {
  try {
    logger.info('Inventory API', `Mengambil ringkasan sesi ID: ${sessionId}`)

    const response = await api.get<RingkasanSesi>(
      `/inventory/sessions/${sessionId}/summary`
    )

    logger.success('Inventory API', 'Ringkasan sesi berhasil diambil', {
      totalDicek: response.data.totalDicek,
      totalBelumDicek: response.data.totalBelumDicek,
    })

    return response.data
  } catch (error) {
    logger.error('Inventory API', 'Gagal mengambil ringkasan sesi', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SESI_TIDAK_DITEMUKAN
    )
  }
}

/**
 * Menyelesaikan sesi inventarisasi
 *
 * @param sessionId - ID sesi inventarisasi
 * @param konfirmasi - Konfirmasi melanjutkan meski ada aset belum dicek
 * @returns Sesi yang sudah diupdate
 */
export async function selesaikanSesi(
  sessionId: number,
  konfirmasi = false
): Promise<SesiInventarisasi> {
  try {
    logger.info('Inventory API', `Menyelesaikan sesi ID: ${sessionId}`, {
      konfirmasi,
    })

    const response = await api.post<SesiInventarisasi>(
      `/inventory/sessions/${sessionId}/complete`,
      { konfirmasiAsetBelumDicek: konfirmasi }
    )

    logger.success('Inventory API', 'Sesi berhasil diselesaikan', {
      id: response.data.id,
      totalDicek: response.data.totalDicek,
    })

    return response.data
  } catch (error) {
    logger.error('Inventory API', 'Gagal menyelesaikan sesi', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.GAGAL_MENYELESAIKAN
    )
  }
}

/**
 * Membatalkan sesi inventarisasi
 *
 * @param sessionId - ID sesi inventarisasi
 * @param alasan - Alasan pembatalan
 */
export async function batalkanSesi(
  sessionId: number,
  alasan: string
): Promise<void> {
  try {
    logger.info('Inventory API', `Membatalkan sesi ID: ${sessionId}`)

    await api.post(`/inventory/sessions/${sessionId}/cancel`, { alasan })

    logger.success('Inventory API', 'Sesi berhasil dibatalkan')
  } catch (error) {
    logger.error('Inventory API', 'Gagal membatalkan sesi', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SERVER_ERROR
    )
  }
}

// ============================================================
// API FUNCTIONS: LAPORAN
// ============================================================

/**
 * Download laporan inventarisasi dalam format PDF atau Excel
 *
 * @param sessionId - ID sesi inventarisasi
 * @param format - Format laporan (pdf/excel)
 * @returns Blob file laporan
 */
export async function downloadLaporan(
  sessionId: number,
  format: 'pdf' | 'excel' = 'pdf'
): Promise<Blob> {
  try {
    logger.info('Inventory API', `Download laporan sesi ID: ${sessionId}`, {
      format,
    })

    const response = await api.get(`/inventory/sessions/${sessionId}/report`, {
      params: { format },
      responseType: 'blob',
    })

    logger.success('Inventory API', 'Laporan berhasil didownload')
    return response.data
  } catch (error) {
    logger.error('Inventory API', 'Gagal download laporan', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SERVER_ERROR
    )
  }
}

// ============================================================
// API FUNCTIONS: LOKASI
// ============================================================

/**
 * Mengambil daftar lokasi untuk dropdown
 *
 * @returns Daftar lokasi dengan jumlah aset
 */
export async function getDaftarLokasi(): Promise<Lokasi[]> {
  try {
    logger.info('Inventory API', 'Mengambil daftar lokasi')

    const response = await api.get<Lokasi[]>('/locations')

    logger.success(
      'Inventory API',
      `Berhasil mengambil ${response.data.length} lokasi`
    )

    return response.data
  } catch (error) {
    logger.error('Inventory API', 'Gagal mengambil daftar lokasi', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SERVER_ERROR
    )
  }
}

/**
 * Mengambil daftar aset di lokasi tertentu
 *
 * @param lokasiId - ID lokasi
 * @returns Daftar aset di lokasi tersebut
 */
export async function getAsetDiLokasi(lokasiId: number): Promise<InfoAset[]> {
  try {
    logger.info('Inventory API', `Mengambil aset di lokasi ID: ${lokasiId}`)

    const response = await api.get<InfoAset[]>('/assets', {
      params: { lokasiId },
    })

    logger.success(
      'Inventory API',
      `Berhasil mengambil ${response.data.length} aset`
    )

    return response.data
  } catch (error) {
    logger.error('Inventory API', 'Gagal mengambil aset di lokasi', error)
    throw new Error(
      getErrorMessage(error) || INVENTORY_ERROR_MESSAGES.SERVER_ERROR
    )
  }
}
