import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { getAssets } from '../../libs/api/assets'
import { createLoan } from '../../libs/api/loans'
import { showErrorToast, showSuccessToast } from '../../libs/ui/toast'
import { logger } from '../../libs/utils/logger'
import {
  type CreateLoanFormValues,
  createLoanSchema,
} from '../../libs/validation/loanSchemas'

// Komponen Halaman Catat Peminjaman
// Form untuk mencatat peminjaman aset baru
export function LoanCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch Daftar Aset
  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: () => getAssets(),
  })

  const assets = assetsResponse?.data ?? []

  // Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateLoanFormValues>({
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver type compatibility with react-hook-form
    resolver: zodResolver(createLoanSchema) as any,
    defaultValues: {
      tanggalPinjam: new Date().toISOString().split('T')[0],
      items: [],
    },
  })

  // Watch selected asset for single-item loan (simplified)
  const selectedAssetId = watch('items.0.assetId')

  // Mutation Create Loan
  const createMutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      showSuccessToast('Peminjaman berhasil dicatat')
      navigate('/loans')
    },
    onError: (error: unknown) => {
      logger.error('LoanCreatePage', 'Gagal mencatat peminjaman', error)
      showErrorToast('Gagal mencatat peminjaman. Pastikan aset tersedia.')
    },
  })

  const onSubmit = (data: CreateLoanFormValues) => {
    createMutation.mutate(data)
  }

  const handleAssetSelect = (assetId: number) => {
    const asset = assets.find((a) => a.id === assetId)
    if (asset) {
      setValue('items', [
        {
          assetId: asset.id,
          conditionBefore:
            asset.kondisi === 'Hilang' ? undefined : asset.kondisi,
        },
      ])
    }
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
              htmlFor="assetId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aset yang Dipinjam <span className="text-red-500">*</span>
            </label>
            <select
              id="assetId"
              value={selectedAssetId || ''}
              onChange={(e) => handleAssetSelect(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                errors.items ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoadingAssets}
            >
              <option value="">Pilih Aset...</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.namaBarang} ({asset.kodeAset}) - {asset.kondisi}
                </option>
              ))}
            </select>
            {errors.items && (
              <p className="mt-1 text-sm text-red-500">
                {errors.items.message || 'Pilih minimal 1 aset'}
              </p>
            )}
          </div>

          {/* Tanggal Pinjam */}
          <div>
            <label
              htmlFor="tanggalPinjam"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Pinjam <span className="text-red-500">*</span>
            </label>
            <input
              id="tanggalPinjam"
              type="date"
              {...register('tanggalPinjam')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.tanggalPinjam ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tanggalPinjam && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tanggalPinjam.message}
              </p>
            )}
          </div>

          {/* Tujuan Pinjam */}
          <div>
            <label
              htmlFor="tujuanPinjam"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tujuan Peminjaman (Opsional)
            </label>
            <input
              id="tujuanPinjam"
              type="text"
              {...register('tujuanPinjam')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: Untuk kegiatan upacara"
            />
          </div>

          {/* Catatan */}
          <div>
            <label
              htmlFor="catatan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catatan (Opsional)
            </label>
            <textarea
              id="catatan"
              {...register('catatan')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Catatan tambahan..."
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
              disabled={createMutation.isPending || !selectedAssetId}
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
