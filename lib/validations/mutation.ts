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
