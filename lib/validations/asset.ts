import { z } from "zod"

export const assetSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    status: z.enum(["aktif", "tidak-aktif", "maintenance", "dihapuskan"]),
    location: z.string(),
    purchaseDate: z.string(),
    purchasePrice: z.number(),
    condition: z.enum(["baik", "cukup", "kurang", "rusak"]),
    description: z.string(),
})

export type TAsset = z.infer<typeof assetSchema>

// Input schema for creating new asset
export const createAssetSchema = z.object({
    name: z.string().min(1, "Nama aset wajib diisi"),
    category: z.string().min(1, "Kategori wajib dipilih"),
    location: z.string().min(1, "Lokasi wajib dipilih"),
    purchaseDate: z.string().min(1, "Tanggal pembelian wajib diisi"),
    purchasePrice: z.coerce.number().min(0, "Harga harus positif"),
    description: z.string().default(""),
})

export type CreateAssetInput = z.infer<typeof createAssetSchema>
