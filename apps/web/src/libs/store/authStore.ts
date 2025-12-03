import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

// Tipe data untuk User (sementara minimal, bisa dikembangkan)
export interface User {
  id: string
  username: string
  name: string
  role?: string
  roles?: string[] // Role labels from backend JWT
}

// Tipe data untuk state autentikasi
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  rememberMe: boolean
  login: (user: User, token: string, rememberMe?: boolean) => void
  logout: () => void
  checkTokenExpiry: () => boolean
}

// Custom storage yang bisa memilih localStorage atau sessionStorage
const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name)
    if (item) {
      // Check if token is expired (30 days)
      try {
        const parsed = JSON.parse(item)
        if (parsed.state?.token && parsed.state?.rememberMe) {
          const tokenTimestamp = parsed.state.tokenTimestamp
          if (
            tokenTimestamp &&
            Date.now() - tokenTimestamp > 30 * 24 * 60 * 60 * 1000
          ) {
            localStorage.removeItem(name)
            return null
          }
        }
      } catch {
        // If parsing fails, remove the item
        localStorage.removeItem(name)
        return null
      }
    }
    return item
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value)
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

// Store global untuk menyimpan status autentikasi pengguna SIMANIS
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        rememberMe: false,

        // Fungsi login: menyimpan data user & token, set status authenticated
        login: (user, token, rememberMe = false) => {
          const storageKey = rememberMe
            ? 'simanis-auth-storage'
            : 'simanis-auth-session'

          // Store token with timestamp for expiry checking
          const authData = {
            user,
            token,
            isAuthenticated: true,
            rememberMe,
            tokenTimestamp: rememberMe ? Date.now() : undefined,
          }

          if (rememberMe) {
            localStorage.setItem(
              storageKey,
              JSON.stringify({ state: authData })
            )
          } else {
            sessionStorage.setItem(
              storageKey,
              JSON.stringify({ state: authData })
            )
          }

          set({ user, token, isAuthenticated: true, rememberMe })
        },

        // Fungsi logout: menghapus semua data sesi
        logout: () => {
          localStorage.removeItem('simanis-auth-storage')
          localStorage.removeItem('simanis-auth-session')
          sessionStorage.removeItem('simanis-auth-session')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            rememberMe: false,
          })
        },

        // Check if token is expired
        checkTokenExpiry: () => {
          const state = get()
          if (!state.token || !state.rememberMe) return true

          const storedData = localStorage.getItem('simanis-auth-storage')
          if (!storedData) return false

          try {
            const parsed = JSON.parse(storedData)
            const tokenTimestamp = parsed.state?.tokenTimestamp
            if (!tokenTimestamp) return true

            const isExpired =
              Date.now() - tokenTimestamp > 30 * 24 * 60 * 60 * 1000
            if (isExpired) {
              get().logout()
            }
            return !isExpired
          } catch {
            get().logout()
            return false
          }
        },
      }),
      {
        name: 'simanis-auth-storage',
        storage: createJSONStorage(() => customStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          rememberMe: state.rememberMe,
          tokenTimestamp: state.rememberMe ? Date.now() : undefined,
        }),
      }
    ),
    { name: 'AuthStore', enabled: import.meta.env.DEV }
  )
)
