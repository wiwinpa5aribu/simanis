/**
 * DepreciationListPage - Halaman utama penyusutan dengan tab navigation
 * Validates: All depreciation requirements
 */

import { useMutation } from '@tanstack/react-query'
import { Download, BarChart3, List, Settings, Calculator } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  downloadDepreciationReport,
  simulateDepreciation,
  type DepreciationListItem,
  type SimulateDepreciationResult,
} from '@/libs/api/depreciation'
import {
  DepreciationChart,
  DepreciationDetailModal,
  DepreciationFilters,
  DepreciationSummaryCards,
  DepreciationTable,
  SimulationForm,
  SimulationResult,
  UsefulLifeSettings,
} from './components'

export default function DepreciationListPage() {
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [year, setYear] = useState<number | undefined>()
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [simulationResult, setSimulationResult] =
    useState<SimulateDepreciationResult | null>(null)

  // Simulation mutation
  const simulateMutation = useMutation({
    mutationFn: simulateDepreciation,
    onSuccess: (data) => {
      setSimulationResult(data)
      toast.success('Simulasi berhasil dijalankan')
    },
    onError: () => {
      toast.error('Gagal menjalankan simulasi')
    },
  })

  // Download report mutation
  const downloadMutation = useMutation({
    mutationFn: () =>
      downloadDepreciationReport({
        year: year ?? new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        categoryId,
      }),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Laporan_Penyusutan_${year ?? new Date().getFullYear()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Laporan berhasil diunduh')
    },
    onError: () => {
      toast.error('Gagal mengunduh laporan')
    },
  })

  const handleViewDetail = (item: DepreciationListItem) => {
    setSelectedAssetId(item.id)
    setDetailModalOpen(true)
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Penyusutan Aset</h1>
          <p className="text-gray-500">
            Kelola dan pantau penyusutan nilai aset sekolah
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => downloadMutation.mutate()}
          disabled={downloadMutation.isPending}
        >
          <Download className="mr-2 h-4 w-4" />
          {downloadMutation.isPending ? 'Mengunduh...' : 'Unduh Laporan'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Daftar</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Simulasi</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Pengaturan</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <DepreciationFilters
            categoryId={categoryId}
            year={year}
            onCategoryChange={setCategoryId}
            onYearChange={setYear}
          />
          <DepreciationSummaryCards categoryId={categoryId} year={year} />
          <DepreciationChart categoryId={categoryId} />
        </TabsContent>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-6">
          <DepreciationFilters
            categoryId={categoryId}
            year={year}
            onCategoryChange={setCategoryId}
            onYearChange={setYear}
          />
          <DepreciationTable
            categoryId={categoryId}
            year={year}
            onViewDetail={handleViewDetail}
          />
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SimulationForm
                onSimulate={(params) => simulateMutation.mutate(params)}
                isLoading={simulateMutation.isPending}
              />
            </div>
            <div className="lg:col-span-2">
              <SimulationResult result={simulationResult} />
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <UsefulLifeSettings />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <DepreciationDetailModal
        assetId={selectedAssetId}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedAssetId(null)
        }}
      />
    </div>
  )
}
