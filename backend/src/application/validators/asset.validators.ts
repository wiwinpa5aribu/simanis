import { z } from 'zod';

/**
 * Create asset schema
 */
export const createAssetSchema = z.object({
  kodeAset: z.string().max(50).optional(), // Auto-generated if not provided
  namaBarang: z.string().min(1, 'Nama barang wajib diisi').max(160),
  merk: z.string().max(120).optional(),
  spesifikasi: z.string().optional(),
  tahunPerolehan: z.string().optional(), // Will be converted to Date
  harga: z.number().min(0, 'Harga tidak boleh negatif'),
  sumberDana: z.enum(['BOS', 'APBD', 'Hibah'], {
    errorMap: () => ({ message: 'Sumber dana harus BOS, APBD, atau Hibah' }),
  }),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'], {
    errorMap: () => ({ message: 'Kondisi tidak valid' }),
  }),
  fotoUrl: z.string().url().optional(),
  categoryId: z.number().int().positive().optional(),
  masaManfaatTahun: z.number().int().min(0).default(0),
  currentRoomId: z.number().int().positive().optional(),
});

/**
 * Update asset schema
 */
export const updateAssetSchema = z.object({
  namaBarang: z.string().min(1).max(160).optional(),
  merk: z.string().max(120).optional(),
  spesifikasi: z.string().optional(),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang']).optional(),
  fotoUrl: z.string().url().optional(),
  categoryId: z.number().int().positive().optional(),
  currentRoomId: z.number().int().positive().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
