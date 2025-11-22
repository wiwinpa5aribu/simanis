import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, CheckCircle } from 'lucide-react'
import { getLoans, returnLoan } from '../../libs/api/loans'
import type { Loan } from '../../libs/validation/loanSchemas'
import { LoadingSpinner, ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { DataTable, type Column } from '../../components/table/DataTable'
import { FilterBar } from '../../components/filters/FilterBar'
import { useFilterStore } from '../../libs/store/filterStore'
import { showSuccessToast, showErrorToast } from '../../libs/ui/toast'
import { logger } from '../../libs/utils/logger'

// Komponen Halaman Daftar Peminjaman
// Menampilkan tabel peminjaman dan aksi pengembalian
export function LoansListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Filter state persistence
  const routeKey = 'loans-list'
  const { setFilter, getFilter } = useFilterStore()
  const savedFilters = getFilter(routeKey) || {}

  const [searchTerm, setSearchTerm] = useState(
    (savedFilters.search as string) || ''
  )

  // Lifecycle logging
  useEffect(() => {
    logger.lifecycle('LoansListPage', 'mount', { savedFilters })
    return () => {
      logger.lifecycle('LoansListPage', 'unmount')
    }
  }, [])

  // Update store saat filter berubah
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter(routeKey, { search: searchTerm })
    }, 500) // Debounce save
    return () => clearTimeout(timeoutId)
  }, [searchTerm, setFilter])

  // Fetch Data Peminjaman
  const {
    data: loans,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['loans'],
    queryFn: getLoans,
  })

  // Mutation: Tandai Dikembalikan
  const returnMutation = useMutation({
    mutationFn: ({ id, date }: { id: number; date: string }) =>
      returnLoan(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      showSuccessToast('Aset berhasil ditandai dikembalikan.')
    },
    onError: (error) => {
      console.error('Gagal mengembalikan aset:', error)
      showErrorToast('Gagal memproses pengembalian.')
    },
  })

  const handleReturn = (item: Loan) => {
    logger.info('LoansListPage', 'User clicked return loan', {
      loanId: item.id,
      borrower: item.borrower_name,
      assetId: item.asset_id,
    })

    if (confirm('Tandai aset ini sebagai dikembalikan hari ini?')) {
      const today = new Date().toISOString().split('T')[0]
      returnMutation.mutate({ id: item.id, date: today })
    }
  }

  // Filter client-side
  const filteredLoans =
    loans?.filter(
      (loan) =>
        loan.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loan.asset_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Definisi kolom
  const columns: Column<Loan>[] = [
    {
      key: 'borrower_name',
      header: 'Peminjam',
      cell: (item) => <span className="font-medium">{item.borrower_name}</span>,
    },
    {
      key: 'asset_name',
      header: 'Aset',
      cell: (item) => item.asset_name || `Aset #${item.asset_id}`,
    },
    {
      key: 'loan_date',
      header: 'Tanggal Pinjam',
      cell: (item) => item.loan_date,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.status === 'Dikembalikan'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Aksi',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          {item.status === 'Dipinjam' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReturn(item)}
              className="text-blue-600 hover:text-blue-900"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Kembalikan
            </Button>
          ) : (
            <span className="text-gray-400 text-xs py-2 px-3">Selesai</span>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <LoadingSpinner text="Memuat data peminjaman..." />
  }

  if (isError) {
    return (
      <ErrorAlert message="Gagal memuat data peminjaman. Silakan coba lagi nanti." />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peminjaman Aset</h1>
          <p className="text-gray-500">
            Kelola peminjaman dan pengembalian aset
          </p>
        </div>
        <Button onClick={() => navigate('/loans/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Catat Peminjaman
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar onReset={() => setSearchTerm('')} isLoading={isLoading}>
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari peminjam atau nama aset..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </FilterBar>

      {/* Tabel Peminjaman */}
      <DataTable
        columns={columns}
        data={filteredLoans}
        isLoading={isLoading}
        pagination={{
          page: 1,
          pageSize: filteredLoans.length,
          total: filteredLoans.length,
          totalPages: 1,
        }}
        emptyMessage="Belum ada data peminjaman yang sesuai."
      />
    </div>
  )
}
