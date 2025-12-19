import { z } from "zod"

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["admin", "manager", "staff", "viewer"]),
    department: z.string(),
    status: z.enum(["aktif", "tidak-aktif"]),
    avatar: z.string(),
    avatarUrl: z.string().optional(),
})

export type TUser = z.infer<typeof userSchema>
