import { prisma } from "@/lib/db"
import { userSchema, createUserSchema, type TUser, type CreateUserInput } from "@/lib/validations/user"

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

    /**
     * Creates a new user in the database.
     * @param {CreateUserInput} data - The user data to create.
     * @returns {Promise<TUser>} The created and validated user object.
     */
    create: async (data: CreateUserInput): Promise<TUser> => {
        const validated = createUserSchema.parse(data)
        const id = await userService.generateId()
        
        const user = await prisma.user.create({
            data: {
                id,
                name: validated.name,
                email: validated.email,
                role: validated.role,
                status: "aktif",
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(validated.name)}`,
            }
        })
        
        return userSchema.parse(user)
    },

    /**
     * Generates a unique user ID following USR-XXX pattern.
     * @returns {Promise<string>} The generated unique ID.
     */
    generateId: async (): Promise<string> => {
        const lastUser = await prisma.user.findFirst({
            orderBy: { id: "desc" },
            where: { id: { startsWith: "USR-" } }
        })
        const lastNum = lastUser ? parseInt(lastUser.id.split("-")[1]) : 0
        return `USR-${String(lastNum + 1).padStart(3, "0")}`
    },

    /**
     * Checks if an email already exists in the database.
     * @param {string} email - The email to check.
     * @returns {Promise<boolean>} True if email exists, false otherwise.
     */
    checkEmailExists: async (email: string): Promise<boolean> => {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        return !!user
    },
}

