import { stockOpnames } from "@/lib/data"
import { stockOpnameSchema, type TStockOpname } from "@/lib/validations/stock-opname"

/**
 * Service for managing Stock Opname sessions.
 */
export const stockOpnameService = {
    /**
     * Retrieves all stock opname sessions and validates them against the schema.
     * @returns {TStockOpname[]} An array of validated session objects.
     */
    getAll: (): TStockOpname[] => {
        return stockOpnames.map((session) => {
            const result = stockOpnameSchema.safeParse(session)
            if (!result.success) {
                console.error("Validation error for stock opname session:", session.id, result.error.format())
                throw new Error(`Data stock opname tidak valid: ${session.id}`)
            }
            return result.data
        })
    },
}


