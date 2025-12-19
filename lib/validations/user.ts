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
