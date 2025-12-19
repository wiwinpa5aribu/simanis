import { prisma } from "@/lib/db"
import { userSchema, type TUser } from "@/lib/validations/user"

/**
 * Service for managing User and Permission data.
 * Handles fetching and validation of system users from database.
 */
export const userService = {
    getAll: async (): Promise<TUser[]> => {
        const users = await prisma.user.findMany()
        return users.map((user: any) => {

            const result = userSchema.safeParse(user)
            if (!result.success) {
                console.error("Validation error for user:", user.id, result.error.format())
                throw new Error(`Data user tidak valid: ${user.id}`)
            }
            return result.data
        })
    },
}

