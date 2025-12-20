import { z } from "zod"

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["admin", "manager", "staff", "viewer"]),
    status: z.enum(["aktif", "tidak-aktif"]),
    avatar: z.string(),
})

export type TUser = z.infer<typeof userSchema>

// Input schema for creating new user
export const createUserSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    role: z.enum(["admin", "manager", "staff", "viewer"], {
        required_error: "Role wajib dipilih"
    }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
