import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, CheckCircle } from 'lucide-react'
import { getLoans, returnLoan } from '../../libs/api/loans'
import type {
  Loan,
  ReturnLoanFormValues,
} from '../../libs/validation/loanSchemas'
import { LoadingSpinner, ErrorAlert } from '../../components/ui/Feedback'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { DataTable, type Column } from '../../components/table/DataTable'
import { FilterBar } from '../../components/filters/FilterBar'
import { useFilterStore } from '../../libs/store/filterStore'
import { showSuccessToast, showErrorToast } from '../../libs/ui/toast'
import { logger } from '../../libs/utils/logger'

// Komponen Halaman Daftar Peminjaman
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update store saat filter berubah
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter(routeKey, { search: searchTerm })
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, setFilter])

  // Fetch Data Peminjaman
  const {
    data: loansResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['loans'],
    queryFn: () => getLoans(),
  })

  const loans = loansResponse?.data ?? []

  // Mutation: Tandai Dikembalikan
  const returnMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReturnLoanFormValues }) =>
      returnLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      showSuccessToast('Aset berhasil ditandai dikembalikan.')
    },
    onError: (error) => {
      logger.error('LoansListPage', 'Gagal mengembalikan aset', error)
      showErrorToast('Gagal memproses pengembalian.')
    },
  })

  const handleReturn = (item: Loan) => {
    logger.info('LoansListPage', 'User clicked return loan', {
      loanId: item.id,
    })

    if (window.confirm('Tandai aset ini sebagai dikembalikan hari ini?')) {
      // Create return data with items from loan
      // Filter out 'Hilang' condition as it's not valid for return
      const returnData: ReturnLoanFormValues = {
        items:
          item.items?.map((loanItem) => {
            const condition = loanItem.conditionBefore
            // Only allow valid return conditions
            const validCondition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' =
              condition === 'Baik' ||
              condition === 'Rusak Ringan' ||
              condition === 'Rusak Berat'
                ? condition
                : 'Baik'
            return {
              assetId: loanItem.assetId,
              conditionAfter: validCondition,
            }
          }) ?? [],
      }
      returnMutation.mutate({ id: item.id, data: returnData })
    }
  }

  // Filter client-side
  const filteredLoans = loans.filter((loan: Loan) => {
    const requesterName = loan.requester?.name ?? ''
    return requesterName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Handle row click to navigate to detail
  const handleRowClick = (loan: Loan) => {
    navigate(`/loans/${loan.id}`)
  }

  // Format date helper
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('id-ID')
  }

  // Definisi kolom
  const columns: Column<Loan>[] = [
    {
      key: 'requester',
      header: 'Peminjam',
      cell: (item) => (
        <button
          onClick={() => handleRowClick(item)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
        >
          {item.requester?.name ?? `User #${item.requestedBy}`}
        </button>
      ),
    },
    {
      key: 'items',
      header: 'Jumlah Aset',
      cell: (item) => `${item.items?.length ?? 0} aset`,
    },
    {
      key: 'tanggalPinjam',
      header: 'Tanggal Pinjam',
      cell: (item) => formatDate(item.tanggalPinjam),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.status === 'Dikembalikan'
              ? 'bg-green-100 text-green-800'
              : item.status === 'Terlambat'
                ? 'bg-red-100 text-red-800'
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
          {item.status === 'Dipinjam' || item.status === 'Terlambat' ? (
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
            placeholder="Cari peminjam..."
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
