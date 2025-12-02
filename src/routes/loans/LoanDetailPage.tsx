import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, FileText, Package, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { ErrorAlert, LoadingSpinner } from '../../components/ui/Feedback'
import { getLoanById } from '../../libs/api/loans'
import { LoanItemsTable } from './components/LoanItemsTable'
import { LoanReturnModal } from './components/LoanReturnModal'

export function LoanDetailPage() {
  const { id } = useParams()
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  // Fetch loan detail
  const {
    data: loan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['loan', id],
    queryFn: () => getLoanById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) {
    return <LoadingSpinner text="Memuat detail peminjaman..." />
  }

  if (isError || !loan) {
    return (
      <ErrorAlert message="Gagal memuat data peminjaman. Peminjaman mungkin tidak ditemukan." />
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Dipinjam: 'bg-yellow-100 text-yellow-800',
      Dikembalikan: 'bg-green-100 text-green-800',
      Terlambat: 'bg-red-100 text-red-800',
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/loans"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Peminjaman #{loan.id}
            </h1>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(loan.status)}`}
            >
              {loan.status}
            </span>
          </div>
        </div>

        {/* Return Button - only show when status is Dipinjam */}
        {loan.status === 'Dipinjam' && (
          <Button onClick={() => setIsReturnModalOpen(true)}>
            Proses Pengembalian
          </Button>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requester Info */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Info Peminjam
            </h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Nama</dt>
              <dd className="text-sm font-medium text-gray-900">
                {loan.requester.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Username</dt>
              <dd className="text-sm text-gray-900">
                {loan.requester.username}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">
                {loan.requester.email || '-'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Loan Info */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Info Peminjaman
            </h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Tanggal Pinjam</dt>
              <dd className="text-sm font-medium text-gray-900">
                {new Date(loan.tanggalPinjam).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Tanggal Kembali</dt>
              <dd className="text-sm text-gray-900">
                {loan.tanggalKembali
                  ? new Date(loan.tanggalKembali).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Purpose */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Tujuan Peminjaman
          </h3>
        </div>
        <p className="text-gray-700">{loan.tujuanPinjam}</p>
        {loan.catatan && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Catatan:</p>
            <p className="text-gray-700">{loan.catatan}</p>
          </div>
        )}
      </div>

      {/* Loan Items */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <Package className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Daftar Aset Dipinjam ({loan.items.length})
          </h3>
        </div>
        <LoanItemsTable items={loan.items} />
      </div>

      {/* Return Modal */}
      <LoanReturnModal
        loan={loan}
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
      />
    </div>
  )
}
