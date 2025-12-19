import { users } from "@/lib/data"
import { userSchema, type TUser } from "@/lib/validations/user"

/**
 * Service for managing User and Permission data.
 * Handles fetching and validation of system users.
 */
export const userService = {
    getAll: (): TUser[] => {
        return users.map((user) => {
            const result = userSchema.safeParse(user)
            if (!result.success) {
                console.error("Validation error for user:", user.id, result.error.format())
                throw new Error(`Data user tidak valid: ${user.id}`)
            }
            return result.data
        })
    },
}
