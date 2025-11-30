import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface FavoriteStore {
  favoriteAssetIds: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteStore>()(
  devtools(
    persist(
      (set, get) => ({
        favoriteAssetIds: [],
        toggleFavorite: (id) => {
          const list = get().favoriteAssetIds
          const exists = list.includes(id)
          set({
            favoriteAssetIds: exists
              ? list.filter((x) => x !== id)
              : [...list, id],
          })
        },
        isFavorite: (id) => get().favoriteAssetIds.includes(id),
        clearFavorites: () => set({ favoriteAssetIds: [] }),
      }),
      { name: 'simanis-favorites' }
    ),
    { name: 'FavoriteStore', enabled: import.meta.env.DEV }
  )
)
