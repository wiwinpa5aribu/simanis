import { prisma } from "@/lib/db"
import { mutationSchema, type TMutation } from "@/lib/validations/mutation"

/**
 * Service for managing Asset Mutation records.
 */
export const mutationService = {
    /**
     * Retrieves all mutations from database and validates them.
     */
    getAll: async (): Promise<TMutation[]> => {
        const mutations = await prisma.mutation.findMany()
        return mutations.map((mut: any) => {
            const result = mutationSchema.safeParse(mut)
            if (!result.success) {
                console.error("Validation error for mutation:", mut.id, result.error.format())
                throw new Error(`Data mutasi tidak valid: ${mut.id}`)
            }
            return result.data
        })
    },
}


