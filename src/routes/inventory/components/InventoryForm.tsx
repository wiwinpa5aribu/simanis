/**
 * Form Inventarisasi
 *
 * Form untuk mencatat inventarisasi aset dengan upload foto dan catatan.
 * Menggunakan React Hook Form + Zod untuk validasi.
 *
 * Props:
 * - assetId: ID aset yang akan diinventarisasi
 * - onSuccess: callback saat berhasil submit
 * - onCancel: callback saat batal
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import {
  inventoryCreateSchema,
  type InventoryCreateInput,
} from '@/libs/validation/inventorySchemas'
import { createInventory } from '@/libs/api/inventory'
import { FileUpload } from '@/components/uploads/FileUpload'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface InventoryFormProps {
  assetId: number
  assetCode: string
  assetName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function InventoryForm({
  assetId,
  assetCode,
  assetName,
  onSuccess,
  onCancel,
}: InventoryFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<InventoryCreateInput>({
    resolver: zodResolver(inventoryCreateSchema),
    defaultValues: {
      asset_id: assetId,
    },
  })

  const mutation = useMutation({
    mutationFn: createInventory,
    onSuccess: () => {
      // Invalidate inventory list query
      queryClient.invalidateQueries({ queryKey: ['inventory'] })

      // Reset form
      reset()
      setSelectedFile(null)

      // Callback
      if (onSuccess) onSuccess()
    },
  })

  const onSubmit = (data: InventoryCreateInput) => {
    mutation.mutate({
      asset_id: data.asset_id,
      photo: selectedFile || undefined,
      note: data.note,
    })
  }

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    setValue('photo', file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Info Aset */}
      <div className="p-4 bg-muted rounded-md space-y-1">
        <p className="text-sm font-medium">Aset yang Diinventarisasi</p>
        <p className="text-lg font-semibold">{assetCode}</p>
        <p className="text-sm text-muted-foreground">{assetName}</p>
      </div>

      {/* Upload Foto */}
      <div className="space-y-2">
        <FileUpload
          accept="image/jpeg,image/jpg,image/png,image/webp"
          maxSizeMB={5}
          onUpload={handleFileUpload}
          label="Foto Bukti Inventarisasi"
        />
        {errors.photo && (
          <p className="text-sm text-destructive">{errors.photo.message}</p>
        )}
      </div>

      {/* Catatan */}
      <div className="space-y-2">
        <Label htmlFor="note">Catatan (Opsional)</Label>
        <Textarea
          id="note"
          placeholder="Tambahkan catatan kondisi atau lokasi aset..."
          rows={4}
          {...register('note')}
        />
        {errors.note && (
          <p className="text-sm text-destructive">{errors.note.message}</p>
        )}
        <p className="text-xs text-muted-foreground">Maksimal 500 karakter</p>
      </div>

      {/* Error dari API */}
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'Gagal menyimpan inventarisasi'}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={mutation.isPending}
            className="flex-1"
          >
            Batal
          </Button>
        )}

        <Button type="submit" disabled={mutation.isPending} className="flex-1">
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Simpan Inventarisasi
        </Button>
      </div>
    </form>
  )
}
