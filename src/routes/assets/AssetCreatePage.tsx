import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { createAsset } from '../../libs/api/assets'
import { getCategories } from '../../libs/api/categories'
import { getRooms } from '../../libs/api/locations'
import {
  createAssetSchema,
  type CreateAssetFormValues,
  ASSET_CONDITIONS,
  SUMBER_DANA_VALUES,
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

  // Fetch Ruangan untuk Dropdown Lokasi
  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  })

  // Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createAssetSchema) as any, // Bypass type mismatch for coerced values
    defaultValues: {
      kondisi: 'Baik',
      sumberDana: 'BOS',
      harga: 0,
      masaManfaatTahun: 0,
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

  const onSubmit = (data: CreateAssetFormValues) => {
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
                <label
                  htmlFor="kodeAset"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kode Aset <span className="text-red-500">*</span>
                </label>
                <input
                  id="kodeAset"
                  type="text"
                  {...register('kodeAset')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.kodeAset ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Misal: SCH/EL/LPT/001"
                />
                {errors.kodeAset && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.kodeAset.message}
                  </p>
                )}
              </div>

              {/* Nama Barang */}
              <div>
                <label
                  htmlFor="namaBarang"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  id="namaBarang"
                  type="text"
                  {...register('namaBarang')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.namaBarang ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Misal: Laptop Lenovo ThinkPad"
                />
                {errors.namaBarang && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.namaBarang.message}
                  </p>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  {...register('categoryId')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
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
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Kondisi */}
              <div>
                <label
                  htmlFor="kondisi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <select
                  id="kondisi"
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

          {/* Section: Informasi Perolehan */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 pt-4">
              Informasi Perolehan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Harga */}
              <div>
                <label
                  htmlFor="harga"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Harga Perolehan <span className="text-red-500">*</span>
                </label>
                <input
                  id="harga"
                  type="number"
                  {...register('harga')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.harga ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Misal: 5000000"
                />
                {errors.harga && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.harga.message}
                  </p>
                )}
              </div>

              {/* Sumber Dana */}
              <div>
                <label
                  htmlFor="sumberDana"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sumber Dana <span className="text-red-500">*</span>
                </label>
                <select
                  id="sumberDana"
                  {...register('sumberDana')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                    errors.sumberDana ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {SUMBER_DANA_VALUES.map((sd) => (
                    <option key={sd} value={sd}>
                      {sd}
                    </option>
                  ))}
                </select>
                {errors.sumberDana && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.sumberDana.message}
                  </p>
                )}
              </div>

              {/* Tahun Perolehan */}
              <div>
                <label
                  htmlFor="tahunPerolehan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tahun Perolehan
                </label>
                <input
                  id="tahunPerolehan"
                  type="date"
                  {...register('tahunPerolehan')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Masa Manfaat */}
              <div>
                <label
                  htmlFor="masaManfaatTahun"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Masa Manfaat (Tahun)
                </label>
                <input
                  id="masaManfaatTahun"
                  type="number"
                  {...register('masaManfaatTahun')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Misal: 5"
                />
              </div>
            </div>
          </div>

          {/* Section: Lokasi & Detail */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 pt-4">
              Lokasi & Detail
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lokasi (Room) */}
              <div>
                <label
                  htmlFor="currentRoomId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lokasi Penempatan
                </label>
                <select
                  id="currentRoomId"
                  {...register('currentRoomId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  disabled={isLoadingRooms}
                >
                  <option value="">Pilih Ruangan</option>
                  {rooms?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} {room.code ? `(${room.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Merk */}
              <div>
                <label
                  htmlFor="merk"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Merk / Brand
                </label>
                <input
                  id="merk"
                  type="text"
                  {...register('merk')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Misal: Lenovo"
                />
              </div>

              {/* Spesifikasi */}
              <div className="md:col-span-2">
                <label
                  htmlFor="spesifikasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Spesifikasi
                </label>
                <textarea
                  id="spesifikasi"
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
