import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { createAsset } from '../../libs/api/assets'
import { getCategories } from '../../libs/api/categories'
import {
  assetSchema,
  type AssetFormValues,
  ASSET_CONDITIONS,
} from '../../libs/validation/assetSchemas'

// Komponen Halaman Tambah Aset
// Menyediakan form lengkap untuk registrasi aset baru
export function AssetCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch Kategori untuk Dropdown
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema) as any, // Bypass type mismatch for coerced values
    defaultValues: {
      kondisi: 'Baik',
    },
  })

  // Mutation Create Asset
  const createMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      navigate('/assets')
    },
    onError: (error: unknown) => {
      console.error('Gagal membuat aset:', error)
      alert('Gagal menyimpan aset. Pastikan Kode Aset unik.')
    },
  })

  const onSubmit = (data: AssetFormValues) => {
    createMutation.mutate(data)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Navigasi Kembali */}
      <div className="flex items-center gap-4">
        <Link
          to="/assets"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Aset Baru</h1>
          <p className="text-gray-500">
            Isi formulir di bawah untuk mendaftarkan aset
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Section: Informasi Utama */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Informasi Utama
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kode Aset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Aset <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('kode_aset')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.kode_aset ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Misal: INV-2024-001"
                />
                {errors.kode_aset && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.kode_aset.message}
                  </p>
                )}
              </div>

              {/* Nama Barang */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('nama_barang')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.nama_barang ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Misal: Laptop Lenovo ThinkPad"
                />
                {errors.nama_barang && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nama_barang.message}
                  </p>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category_id')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoadingCategories}
                >
                  <option value="">Pilih Kategori</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              {/* Kondisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('kondisi')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {ASSET_CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
                {errors.kondisi && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.kondisi.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Detail Tambahan (Opsional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 pt-4">
              Detail Tambahan (Opsional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merk / Brand
                </label>
                <input
                  type="text"
                  {...register('merk')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Misal: Lenovo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Perolehan
                </label>
                <input
                  type="number"
                  {...register('tahun_perolehan')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Misal: 2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spesifikasi
                </label>
                <textarea
                  {...register('spesifikasi')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Deskripsi detail spesifikasi barang..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Link
              to="/assets"
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
                  Simpan Aset
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
