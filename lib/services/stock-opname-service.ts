import { stockOpnameSessions } from "@/lib/data"
import { stockOpnameSchema, type TStockOpname } from "@/lib/validations/stock-opname"

export const stockOpnameService = {
    getAll: (): TStockOpname[] => {
        return stockOpnameSessions.map((session) => {
            const result = stockOpnameSchema.safeParse(session)
            if (!result.success) {
                console.error("Validation error for stock opname session:", session.id, result.error.format())
                throw new Error(`Data stock opname tidak valid: ${session.id}`)
            }
            return result.data
        })
    },
}
