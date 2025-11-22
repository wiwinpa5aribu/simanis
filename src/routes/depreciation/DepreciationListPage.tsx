import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Trash2, Calculator } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useReportPresetStore } from '@/libs/store/reportPresetStore'
import { showSuccessToast } from '@/libs/ui/toast'

interface DepreciationFilters {
  year: string
  category: string
  method: string
}

export default function DepreciationListPage() {
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<DepreciationFilters>({
      defaultValues: {
        year: new Date().getFullYear().toString(),
        category: '',
        method: 'straight_line',
      },
    })

  const filters = watch()

  // Preset Store
  const reportKey = 'depreciation-report'
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
      reset(preset.value as unknown as DepreciationFilters)
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

  const onSubmit = (data: DepreciationFilters) => {
    console.log('Calculating depreciation with:', data)
    showSuccessToast('Menghitung penyusutan...')
  }

  // Mock Data
  const mockDepreciationData = [
    {
      id: 1,
      name: 'Laptop Asus ROG',
      price: 25000000,
      year: 2023,
      value: 15000000,
      depreciation: 5000000,
    },
    {
      id: 2,
      name: 'Proyektor Epson',
      price: 8000000,
      year: 2022,
      value: 4000000,
      depreciation: 2000000,
    },
    {
      id: 3,
      name: 'Meja Guru',
      price: 1500000,
      year: 2020,
      value: 500000,
      depreciation: 250000,
    },
  ]

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penyusutan Aset</h1>
          <p className="text-gray-500">
            Perhitungan penyusutan nilai aset per tahun
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter & Konfigurasi</CardTitle>

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
                      placeholder="Contoh: Penyusutan Elektronik 2024"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="year">Tahun Hitung</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year')}
                  placeholder="2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Aset</Label>
                <Select
                  value={filters.category}
                  onValueChange={(val) => setValue('category', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kategori</SelectItem>
                    <SelectItem value="elektronik">Elektronik</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="kendaraan">Kendaraan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Metode Penyusutan</Label>
                <Select
                  value={filters.method}
                  onValueChange={(val) => setValue('method', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight_line">Garis Lurus</SelectItem>
                    <SelectItem value="declining_balance">Saldo Menurun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Penyusutan
              </Button>
            </div>
          </form>

          {/* Tabel hasil mock */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Hasil Perhitungan (Mock)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Aset</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Tahun</TableHead>
                      <TableHead>Nilai Saat Ini</TableHead>
                      <TableHead>Penyusutan Tahun Ini</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDepreciationData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>Rp {item.price.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>Rp {item.value.toLocaleString('id-ID')}</TableCell>
                        <TableCell>Rp {item.depreciation.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
