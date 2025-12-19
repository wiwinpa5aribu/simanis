import { z } from "zod"

export const stockOpnameSchema = z.object({
    id: z.string(),
    date: z.string(),
    location: z.string(),
    status: z.enum(["sedang-berlangsung", "selesai"]),
    foundCount: z.number(),
    notFoundCount: z.number(),
    totalAssets: z.number(),
})

export type TStockOpname = z.infer<typeof stockOpnameSchema>
