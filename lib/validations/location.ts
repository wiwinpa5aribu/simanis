import { z } from "zod"

export const locationSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["gedung", "lantai", "ruangan"]),
    parentId: z.string().nullable().or(z.null()),
    assetCount: z.number(),
})

export type TLocation = z.infer<typeof locationSchema>

// Input schema for creating new location
export const createLocationSchema = z.object({
    name: z.string().min(1, "Nama lokasi wajib diisi"),
    type: z.enum(["gedung", "lantai", "ruangan"], {
        required_error: "Tipe lokasi wajib dipilih"
    }),
    parentId: z.string().optional(),
})

export type CreateLocationInput = z.infer<typeof createLocationSchema>
