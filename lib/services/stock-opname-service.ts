import { prisma } from "@/lib/db"
import { stockOpnameSchema, type TStockOpname } from "@/lib/validations/stock-opname"

/**
 * Service for managing Stock Opname sessions.
 */
export const stockOpnameService = {
  /**
   * Retrieves all stock opname sessions and validates them.
   */
  getAll: async (): Promise<TStockOpname[]> => {
    const stockOpnames = await prisma.stockOpnameSession.findMany()
    return stockOpnames.map((session: any) => {
      // Convert enum value with hyphen to match schema if necessary
      const formattedSession = {
        ...session,
        status: session.status === "sedang_berlangsung" ? "sedang-berlangsung" : session.status,
      }
      const result = stockOpnameSchema.safeParse(formattedSession)
      if (!result.success) {
        console.error(
          "Validation error for stock opname session:",
          session.id,
          result.error.format(),
        )
        throw new Error(`Data stock opname tidak valid: ${session.id}`)
      }
      return result.data
    })
  },
}
