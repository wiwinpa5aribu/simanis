import { z } from "zod"
import { LocationSchema as GeneratedLocationSchema, LocTypeSchema } from "./generated"

// Override generated schema to use flexible ID (LOC-XXXX format, not CUID)
export const locationSchema = GeneratedLocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  id: z.string(),
})

export type TLocation = z.infer<typeof locationSchema>

// Re-export enums for convenience
export { LocTypeSchema }

// Input schema for creating new location (form validation)
export const createLocationSchema = z.object({
  name: z.string().min(1, "Nama lokasi wajib diisi"),
  type: LocTypeSchema.refine((val) => val !== undefined, {
    message: "Tipe lokasi wajib dipilih",
  }),
  parentId: z.string().optional(),
})

export type CreateLocationInput = z.infer<typeof createLocationSchema>
