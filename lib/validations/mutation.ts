import { z } from "zod"

export const mutationSchema = z.object({
    id: z.string(),
    assetId: z.string(),
    assetName: z.string(),
    fromLocation: z.string(),
    toLocation: z.string(),
    date: z.string(),
    status: z.enum(["pending", "approved", "rejected"]),
    reason: z.string(),
    createdBy: z.string(),
})

export type TMutation = z.infer<typeof mutationSchema>
