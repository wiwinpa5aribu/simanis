import { mutations } from "@/lib/data"
import { mutationSchema, type TMutation } from "@/lib/validations/mutation"

/**
 * Service for managing Asset Mutation records.
 */
export const mutationService = {
    /**
     * Retrieves all mutations and validates them against the schema.
     * @returns {TMutation[]} An array of validated mutation objects.
     */
    getAll: (): TMutation[] => {
        return mutations.map((mut) => {
            const result = mutationSchema.safeParse(mut)
            if (!result.success) {
                console.error("Validation error for mutation:", mut.id, result.error.format())
                throw new Error(`Data mutasi tidak valid: ${mut.id}`)
            }
            return result.data
        })
    },
}

