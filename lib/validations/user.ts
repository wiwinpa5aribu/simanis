import { z } from "zod"
import { UserSchema as GeneratedUserSchema, UserRoleSchema, StatusSchema } from "./generated"

// Override generated schema to use flexible ID (USR-XXXX format, not CUID)
export const userSchema = GeneratedUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  id: z.string(),
})

export type TUser = z.infer<typeof userSchema>

// Re-export enums for convenience
export { UserRoleSchema, StatusSchema }

// Input schema for creating new user (form validation)
export const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: UserRoleSchema.refine((val) => val !== undefined, {
    message: "Role wajib dipilih",
  }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
