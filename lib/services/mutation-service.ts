import { prisma } from "@/lib/db"
import {
  mutationSchema,
  createMutationSchema,
  type TMutation,
  type CreateMutationInput,
} from "@/lib/validations/mutation"

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

  /**
   * Creates a new mutation in the database.
   * @param {CreateMutationInput} data - The mutation data to create.
   * @param {string} assetName - The name of the asset being mutated.
   * @returns {Promise<TMutation>} The created and validated mutation object.
   */
  create: async (data: CreateMutationInput, assetName: string): Promise<TMutation> => {
    const validated = createMutationSchema.parse(data)
    const id = await mutationService.generateId()

    const mutation = await prisma.mutation.create({
      data: {
        id,
        assetId: validated.assetId,
        assetName,
        fromLocation: validated.fromLocation,
        toLocation: validated.toLocation,
        date: validated.date,
        status: "diproses",
        requester: validated.requester,
        notes: validated.notes,
      },
    })

    return mutationSchema.parse(mutation)
  },

  /**
   * Generates a unique mutation ID following MUT-XXX pattern.
   * @returns {Promise<string>} The generated unique ID.
   */
  generateId: async (): Promise<string> => {
    const lastMutation = await prisma.mutation.findFirst({
      orderBy: { id: "desc" },
      where: { id: { startsWith: "MUT-" } },
    })
    const lastNum = lastMutation ? parseInt(lastMutation.id.split("-")[1]) : 0
    return `MUT-${String(lastNum + 1).padStart(3, "0")}`
  },
}
