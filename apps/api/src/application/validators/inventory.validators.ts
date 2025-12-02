import { z } from 'zod'

export const createInventorySchema = z.object({
  qrCodeScanned: z.string().min(1, 'QR Code harus diisi'),
  kondisi: z.enum(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'], {
    errorMap: () => ({
      message: 'Kondisi harus BAIK, RUSAK_RINGAN, atau RUSAK_BERAT',
    }),
  }),
  photoUrl: z.string().url('URL foto tidak valid').optional(),
  note: z.string().optional(),
})

export type CreateInventoryInput = z.infer<typeof createInventorySchema>
