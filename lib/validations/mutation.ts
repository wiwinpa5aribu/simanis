import { z } from "zod"

export const mutationSchema = z.object({
    id: z.string(),
    assetId: z.string(),
    assetName: z.string(),
    fromLocation: z.string(),
    toLocation: z.string(),
    date: z.string(),
    status: z.enum(["diproses", "selesai", "dibatalkan"]),
    requester: z.string(),
    notes: z.string(),
})

export type TMutation = z.infer<typeof mutationSchema>

// Input schema for creating new mutation
export const createMutationSchema = z.object({
    assetId: z.string().min(1, "Aset wajib dipilih"),
    fromLocation: z.string().min(1, "Lokasi asal wajib dipilih"),
    toLocation: z.string().min(1, "Lokasi tujuan wajib dipilih"),
    date: z.string().min(1, "Tanggal mutasi wajib diisi"),
    requester: z.string().min(1, "Pemohon wajib diisi"),
    notes: z.string().default(""),
}).refine(data => data.fromLocation !== data.toLocation, {
    message: "Lokasi asal dan tujuan tidak boleh sama",
    path: ["toLocation"]
})

export type CreateMutationInput = z.infer<typeof createMutationSchema>
