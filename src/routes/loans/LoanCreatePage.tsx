import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { createLoan } from '../../libs/api/loans'
import { getAssets } from '../../libs/api/assets'
import {
  loanSchema,
  type LoanFormValues,
} from '../../libs/validation/loanSchemas'
import { logger } from '../../libs/utils/logger'
import { showErrorToast } from '../../libs/ui/toast'

// Komponen Halaman Catat Peminjaman
// Form untuk mencatat peminjaman aset baru
export function LoanCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch Daftar Aset (Hanya yang kondisinya Baik/Tersedia - logic filter di backend idealnya)
  // Untuk phase 1, kita ambil semua aset dulu
  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  })

  // Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loanSchema) as any, // Bypass potential type mismatch
    defaultValues: {
      loan_date: new Date().toISOString().split('T')[0], // Default hari ini
    },
  })

  // Mutation Create Loan
  const createMutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      navigate('/loans')
    },
    onError: (error: unknown) => {
      logger.error('LoanCreatePage', 'Gagal mencatat peminjaman', error)
      showErrorToast('Gagal mencatat peminjaman. Pastikan aset tersedia.')
    },
  })

  const onSubmit = (data: LoanFormValues) => {
    createMutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Navigasi */}
      <div className="flex items-center gap-4">
        <Link
          to="/loans"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catat Peminjaman</h1>
          <p className="text-gray-500">
            Isi formulir untuk mencatat peminjaman aset
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Aset */}
          <div>
            <label
              htmlFor="asset_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aset yang Dipinjam <span className="text-red-500">*</span>
            </label>
            <select
              id="asset_id"
              {...register('asset_id')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.asset_id ? 'border-red-500' : 'border-gray-300'
                }`}
              disabled={isLoadingAssets}
            >
              <option value="">Pilih Aset...</option>
              {assets?.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.nama_barang} ({asset.kode_aset}) - {asset.kondisi}
                </option>
              ))}
            </select>
            {errors.asset_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.asset_id.message}
              </p>
            )}
          </div>

          {/* Nama Peminjam */}
          <div>
            <label
              htmlFor="borrower_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Peminjam <span className="text-red-500">*</span>
            </label>
            <input
              id="borrower_name"
              type="text"
              {...register('borrower_name')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.borrower_name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Nama lengkap peminjam"
            />
            {errors.borrower_name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.borrower_name.message}
              </p>
            )}
          </div>

          {/* Tanggal Pinjam */}
          <div>
            <label
              htmlFor="loan_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Pinjam <span className="text-red-500">*</span>
            </label>
            <input
              id="loan_date"
              type="date"
              {...register('loan_date')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.loan_date ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.loan_date && (
              <p className="mt-1 text-sm text-red-500">
                {errors.loan_date.message}
              </p>
            )}
          </div>

          {/* Catatan */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catatan / Keperluan (Opsional)
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: Untuk kegiatan upacara hari Senin"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              to="/loans"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
