import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FilterState = {
  [routeKey: string]: Record<string, unknown>
}

interface FilterStore {
  filters: FilterState
  setFilter: (routeKey: string, value: Record<string, unknown>) => void
  getFilter: (routeKey: string) => Record<string, unknown> | undefined
  clearFilter: (routeKey: string) => void
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: {},
      setFilter: (routeKey, value) =>
        set((state) => ({
          filters: { ...state.filters, [routeKey]: value },
        })),
      getFilter: (routeKey) => get().filters[routeKey],
      clearFilter: (routeKey) =>
        set((state) => {
          const newFilters = { ...state.filters }
          delete newFilters[routeKey]
          return { filters: newFilters }
        }),
    }),
    { name: 'simanis-filters' }
  )
)
