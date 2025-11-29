import { z } from 'zod'

// Skema validasi untuk form login SIMANIS
// Memastikan username/email dan password diisi sebelum dikirim ke backend
export const loginSchema = z.object({
  username: z.string().min(1, 'Username atau email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>
