import { z } from "zod"
import {
  AssetSchema as GeneratedAssetSchema,
  AssetStatusSchema,
  ConditionSchema,
} from "./generated"

// Override generated schema to use flexible ID (AST-XXXX format, not CUID)
export const assetSchema = GeneratedAssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  id: z.string(),
})

export type TAsset = z.infer<typeof assetSchema>

// Re-export enums for convenience
export { AssetStatusSchema, ConditionSchema }

// Input schema for creating new asset (form validation)
export const createAssetSchema = z.object({
  name: z.string().min(1, "Nama aset wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  location: z.string().min(1, "Lokasi wajib dipilih"),
  purchaseDate: z.string().min(1, "Tanggal pembelian wajib diisi"),
  purchasePrice: z.coerce.number().min(0, "Harga harus positif"),
  description: z.string().default(""),
})

export type CreateAssetInput = z.infer<typeof createAssetSchema>
