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
    specification: z.string().optional(),
    imageUrl: z.string().optional(),
})

export type TAsset = z.infer<typeof assetSchema>
