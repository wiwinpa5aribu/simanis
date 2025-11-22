import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipe data untuk User (sementara minimal, bisa dikembangkan)
export interface User {
  id: string
  username: string
  name: string
  role: string
}

// Tipe data untuk state autentikasi
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

// Store global untuk menyimpan status autentikasi pengguna SIMANIS
// Menggunakan 'persist' middleware agar data tetap tersimpan di localStorage saat refresh
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Fungsi login: menyimpan data user & token, set status authenticated
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      
      // Fungsi logout: menghapus semua data sesi
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'simanis-auth-storage', // Nama key di localStorage
    }
  )
)
