import { z } from "zod"
import { MutationSchema as GeneratedMutationSchema, MutationStatusSchema } from "./generated"

// Override generated schema to use flexible ID (MUT-XXXX format, not CUID)
export const mutationSchema = GeneratedMutationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  id: z.string(),
})

export type TMutation = z.infer<typeof mutationSchema>

// Re-export enums for convenience
export { MutationStatusSchema }

// Input schema for creating new mutation (form validation)
export const createMutationSchema = z
  .object({
    assetId: z.string().min(1, "Aset wajib dipilih"),
    fromLocation: z.string().min(1, "Lokasi asal wajib dipilih"),
    toLocation: z.string().min(1, "Lokasi tujuan wajib dipilih"),
    date: z.string().min(1, "Tanggal mutasi wajib diisi"),
    requester: z.string().min(1, "Pemohon wajib diisi"),
    notes: z.string().default(""),
  })
  .refine((data) => data.fromLocation !== data.toLocation, {
    message: "Lokasi asal dan tujuan tidak boleh sama",
    path: ["toLocation"],
  })

export type CreateMutationInput = z.infer<typeof createMutationSchema>
