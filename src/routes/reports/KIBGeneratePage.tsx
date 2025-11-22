import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, FileDown, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useReportPresetStore } from '@/libs/store/reportPresetStore'
import { showSuccessToast } from '@/libs/ui/toast'
import { ASSET_CONDITIONS } from '@/libs/validation/assetSchemas'

interface KIBFilters {
  year: string
  semester: string
  category: string
  condition: string
  room: string
}

export default function KIBGeneratePage() {
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<KIBFilters>({
      defaultValues: {
        year: new Date().getFullYear().toString(),
        semester: '1',
        category: '',
        condition: '',
        room: '',
      },
    })

  const filters = watch()

  // Preset Store
  const reportKey = 'kib-report'
  const { addPreset, removePreset, getPresets } =
    useReportPresetStore()
  const availablePresets = getPresets(reportKey)

  const handleSavePreset = () => {
    if (!presetName) return
    addPreset(reportKey, {
      name: presetName,
      value: filters as unknown as Record<string, unknown>,
    })
    showSuccessToast('Preset filter berhasil disimpan')
    setPresetName('')
    setIsPresetDialogOpen(false)
  }

  const handleLoadPreset = (presetId: string) => {
    const preset = availablePresets.find((p) => p.id === presetId)
    if (preset) {
      reset(preset.value as unknown as KIBFilters)
      setSelectedPresetId(presetId)
      showSuccessToast(`Preset "${preset.name}" dimuat`)
    }
  }

  const handleDeletePreset = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation()
    if (confirm('Hapus preset ini?')) {
      removePreset(reportKey, presetId)
      if (selectedPresetId === presetId) setSelectedPresetId('')
      showSuccessToast('Preset dihapus')
    }
  }

  const onSubmit = (data: KIBFilters) => {
    console.log('Generating KIB with:', data)
    showSuccessToast('Laporan KIB sedang digenerate...')
    // Simulasi download
    setTimeout(() => {
      showSuccessToast('Download dimulai: Laporan_KIB.pdf')
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan KIB</h1>
          <p className="text-gray-500">
            Kartu Inventaris Barang (KIB A, B, C, D, E, F)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter Laporan</CardTitle>

            <div className="flex items-center gap-2">
              {availablePresets.length > 0 && (
                <Select
                  value={selectedPresetId}
                  onValueChange={handleLoadPreset}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Pilih Preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePresets.map((preset) => (
                      <SelectItem
                        key={preset.id}
                        value={preset.id}
                        className="group"
                      >
                        <div className="flex items-center justify-between w-full gap-2">
                          <span>{preset.name}</span>
                          <button
                            onClick={(e) => handleDeletePreset(e, preset.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPresetDialogOpen(true)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Preset
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Simpan Preset Filter</DialogTitle>
                    <DialogDescription>
                      Simpan konfigurasi filter saat ini agar mudah digunakan
                      kembali nanti.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="presetName">Nama Preset</Label>
                    <Input
                      id="presetName"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Contoh: Laporan Semester 1 Lab Komputer"
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPresetDialogOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button onClick={handleSavePreset} disabled={!presetName}>
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year">Tahun Anggaran</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year')}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={filters.semester}
                  onValueChange={(val) => setValue('semester', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1 (Jan - Jun)</SelectItem>
                    <SelectItem value="2">Semester 2 (Jul - Des)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Aset (KIB)</Label>
                <Select
                  value={filters.category}
                  onValueChange={(val) => setValue('category', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">KIB A (Tanah)</SelectItem>
                    <SelectItem value="B">KIB B (Peralatan & Mesin)</SelectItem>
                    <SelectItem value="C">KIB C (Gedung & Bangunan)</SelectItem>
                    <SelectItem value="D">
                      KIB D (Jalan, Irigasi, Jaringan)
                    </SelectItem>
                    <SelectItem value="E">
                      KIB E (Aset Tetap Lainnya)
                    </SelectItem>
                    <SelectItem value="F">
                      KIB F (Konstruksi dlm Pengerjaan)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Kondisi Aset</Label>
                <Select
                  value={filters.condition}
                  onValueChange={(val) => setValue('condition', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_CONDITIONS.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Ruang</Label>
                <Input
                  id="room"
                  {...register('room')}
                  placeholder="Contoh: Lab Komputer / Perpustakaan"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">
                <FileDown className="w-4 h-4 mr-2" />
                Generate Laporan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
