import { z } from 'zod'

// Skema validasi untuk form login SIMANIS
// Memastikan username/email dan password diisi sebelum dikirim ke backend
export const loginSchema = z.object({
  username: z.string().min(1, 'Username atau email wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
  rememberMe: z.boolean().optional(),
})

// Input type untuk form (rememberMe optional)
export type LoginFormInput = z.input<typeof loginSchema>

// Output type setelah validasi
export type LoginFormValues = {
  username: string
  password: string
  rememberMe: boolean
}
