/**
 * Store untuk menyimpan preset filter laporan
 * User dapat menyimpan kombinasi filter yang sering digunakan
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Preset {
  id: string
  name: string
  value: Record<string, unknown>
}

interface PresetStore {
  presets: { [reportKey: string]: Preset[] }
  addPreset: (reportKey: string, preset: Omit<Preset, 'id'>) => void
  removePreset: (reportKey: string, presetId: string) => void
  getPresets: (reportKey: string) => Preset[]
}

export const useReportPresetStore = create<PresetStore>()(
  persist(
    (set, get) => ({
      presets: {},
      addPreset: (reportKey, preset) => {
        const id = Date.now().toString()
        const list = get().presets[reportKey] ?? []
        set({
          presets: {
            ...get().presets,
            [reportKey]: [...list, { ...preset, id }],
          },
        })
      },
      removePreset: (reportKey, presetId) => {
        const list = get().presets[reportKey] ?? []
        set({
          presets: {
            ...get().presets,
            [reportKey]: list.filter((p) => p.id !== presetId),
          },
        })
      },
      getPresets: (reportKey) => get().presets[reportKey] ?? [],
    }),
    { name: 'simanis-report-presets' }
  )
)
