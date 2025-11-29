import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Save, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { updateAsset } from '../../../libs/api/assets'
import { getCategories } from '../../../libs/api/categories'
import { showSuccessToast, showErrorToast } from '../../../libs/ui/toast'
import type { Asset } from '../../../libs/validation/assetSchemas'
import { ASSET_CONDITIONS } from '../../../libs/validation/assetSchemas'

// Schema validasi untuk edit form
const editAssetSchema = z.object({
  nama_barang: z.string()
    .min(1, 'Nama barang wajib diisi')
    .max(160, 'Nama barang maksimal 160 karakter'),
  merk: z.string().optional(),
  spesifikasi: z.string().optional(),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang'], {
    message: 'Kondisi tidak valid',
  }),
  category_id: z.coerce.number().min(1, 'Kategori tidak valid'),
  tahun_perolehan: z.coerce.number().optional(),
})

type EditAssetFormValues = z.infer<typeof editAssetSchema>

interface AssetEditFormProps {
  asset: Asset
  onCancel: () => void
  onSuccess: () => void
}

export function AssetEditForm({ asset, onCancel, onSuccess }: AssetEditFormProps) {
  const queryClient = useQueryClient()

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // Form setup with pre-filled values
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditAssetFormValues>({
    resolver: zodResolver(editAssetSchema) as never,
    defaultValues: {
      nama_barang: asset.nama_barang,
      merk: asset.merk || '',
      spesifikasi: asset.spesifikasi || '',
      kondisi: asset.kondisi,
      category_id: asset.category_id,
      tahun_perolehan: asset.tahun_perolehan,
    },
  })


  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: EditAssetFormValues) => updateAsset(asset.id, {
      ...data,
      kode_aset: asset.kode_aset, // Keep original code
    }),
    onSuccess: () => {
      showSuccessToast('Aset berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['asset', String(asset.id)] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onSuccess()
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Gagal memperbarui aset')
    },
  })

  const onSubmit = (data: EditAssetFormValues) => {
    updateMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {/* Section: Informasi Utama */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
          Informasi Aset
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kode Aset (Read-only) */}
          <div>
            <label htmlFor="kode_aset_display" className="block text-sm font-medium text-gray-700 mb-1">
              Kode Aset
            </label>
            <input
              id="kode_aset_display"
              type="text"
              value={asset.kode_aset}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-400">Kode aset tidak dapat diubah</p>
          </div>

          {/* Nama Barang */}
          <div>
            <label htmlFor="edit_nama_barang" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Barang <span className="text-red-500">*</span>
            </label>
            <input
              id="edit_nama_barang"
              type="text"
              {...register('nama_barang')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.nama_barang ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nama_barang && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_barang.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label htmlFor="edit_category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="edit_category_id"
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
              <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          {/* Kondisi */}
          <div>
            <label htmlFor="edit_kondisi" className="block text-sm font-medium text-gray-700 mb-1">
              Kondisi <span className="text-red-500">*</span>
            </label>
            <select
              id="edit_kondisi"
              {...register('kondisi')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                errors.kondisi ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {ASSET_CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
            {errors.kondisi && (
              <p className="mt-1 text-sm text-red-500">{errors.kondisi.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section: Detail Tambahan */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 pt-4">
          Detail Tambahan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="edit_merk" className="block text-sm font-medium text-gray-700 mb-1">
              Merk / Brand
            </label>
            <input
              id="edit_merk"
              type="text"
              {...register('merk')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="edit_tahun_perolehan" className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Perolehan
            </label>
            <input
              id="edit_tahun_perolehan"
              type="number"
              {...register('tahun_perolehan')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="edit_spesifikasi" className="block text-sm font-medium text-gray-700 mb-1">
              Spesifikasi
            </label>
            <textarea
              id="edit_spesifikasi"
              {...register('spesifikasi')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending || !isDirty}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  )
}
