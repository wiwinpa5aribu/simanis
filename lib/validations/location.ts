import { z } from "zod"

export const locationSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["gedung", "lantai", "ruangan"]),
    parentId: z.string().nullable(),
    assetCount: z.number(),
})


export type TLocation = z.infer<typeof locationSchema>
