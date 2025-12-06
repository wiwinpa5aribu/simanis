/**
 * =====================================================
 * HALAMAN BUAT SESI INVENTARISASI BARU
 * =====================================================
 *
 * Form untuk memulai sesi inventarisasi baru
 * Validates: Requirement 2 (Mulai Inventarisasi Baru)
 *
 * Fitur:
 * - Pilih lokasi (Gedung/Lantai/Ruangan)
 * - Input catatan opsional
 * - Navigasi ke halaman scan setelah sesi dibuat
 *
 * @author SIMANIS Team
 * @version 2.2.0 (Fix TypeScript Implicit Any & Form Types)
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

// Komponen UI
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// API dan Types
import { buatSesiBaru, getDaftarLokasi } from '@/libs/api/inventorySessions'
// Shared Constants
import { ROUTES } from '@/libs/constants'
import type { Lokasi } from '@/libs/types'

// Utilities
import { logger } from '@/libs/utils/logger'

// ============================================================
// SCHEMA & TYPES LOKAL
// ============================================================

// Schema yang dimodifikasi khusus untuk form input (handling empty string)
// Schema yang dimodifikasi khusus untuk form input (handling empty string)
const createFormSchema = z.object({
  lokasiId: z.coerce
    .number({
      invalid_type_error: 'Lokasi wajib dipilih',
    })
    .positive('ID lokasi harus valid'),

  catatan: z.string().optional(), // Biarkan string, transform nanti manual atau di API layer
})

// Tipe data form yang sesuai dengan input UI
type CreateFormValues = z.infer<typeof createFormSchema>

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function InventoryCreatePage() {
  const navigate = useNavigate()

  // ============================================================
  // DATA FETCHING
  // ============================================================

  const { data: lokasiList, isLoading: isLoadingLokasi } = useQuery({
    queryKey: ['locations'],
    queryFn: getDaftarLokasi,
  })

  // ============================================================
  // FORM SETUP
  // ============================================================

  // Inisialisasi form dengan tipe eksplisit
  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      lokasiId: undefined,
      catatan: '',
    },
  })

  // ============================================================
  // MUTATIONS
  // ============================================================

  const createMutation = useMutation({
    mutationFn: buatSesiBaru,
    onSuccess: (sesi) => {
      logger.success('InventoryCreatePage', 'Sesi berhasil dibuat', {
        sessionId: sesi.id,
        lokasi: sesi.lokasiNama,
      })

      toast.success('Sesi Inventarisasi Dimulai', {
        description: `Inventarisasi di ${sesi.lokasiNama} berhasil dimulai`,
      })

      // Navigate to session detail page
      navigate(ROUTES.INVENTORY.SESSION(sesi.id))
    },
    onError: (error) => {
      logger.error('InventoryCreatePage', 'Gagal membuat sesi', error)
      toast.error('Gagal Memulai Inventarisasi', {
        description:
          error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
    },
  })

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  // Gunakan SubmitHandler type
  const onSubmit: SubmitHandler<CreateFormValues> = (data) => {
    logger.info('InventoryCreatePage', 'Membuat sesi baru', data)

    // Transform data sebelum kirim ke API agar sesuai dengan BuatSesiBaruInput
    createMutation.mutate({
      lokasiId: data.lokasiId,
      catatan: data.catatan?.trim() || undefined,
    })
  }

  const handleKembali = () => {
    navigate(ROUTES.INVENTORY.LIST)
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleKembali}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mulai Inventarisasi Baru
          </h1>
          <p className="text-gray-500">
            Pilih lokasi untuk memulai sesi stock opname
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Detail Sesi Inventarisasi
          </CardTitle>
          <CardDescription>
            Pilih lokasi yang akan diinventarisasi. Semua aset di lokasi
            tersebut akan ditampilkan untuk dicek keberadaannya.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Berikan tipe generics ke Form wrapper jika memungkinkan, atau biarkan context */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Field: Lokasi - Explicitly typed FormField */}
              <FormField
                control={form.control}
                name="lokasiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Lokasi Inventarisasi
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoadingLokasi}
                        onValueChange={field.onChange}
                        // Handle undefined value safely
                        value={field.value ? String(field.value) : undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi..." />
                        </SelectTrigger>
                        <SelectContent>
                          {lokasiList?.map((lokasi) => (
                            <SelectItem
                              key={lokasi.id}
                              value={lokasi.id.toString()}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{lokasi.nama}</span>
                                <span className="text-xs text-gray-400 ml-2">
                                  {lokasi.jumlahAset} aset
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Pilih gedung, lantai, atau ruangan yang akan
                      diinventarisasi
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field: Catatan - Explicitly typed FormField */}
              <FormField
                control={form.control}
                name="catatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Catatan (Opsional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Inventarisasi rutin semester genap 2025..."
                        className="min-h-[100px] resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Tambahkan catatan jika diperlukan (maksimal 500 karakter)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleKembali}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memulai...
                    </>
                  ) : (
                    <>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Mulai Inventarisasi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">
            💡 Langkah Inventarisasi
          </h3>
          <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
            <li>Pilih lokasi yang akan diinventarisasi</li>
            <li>Scan QR code pada setiap aset di lokasi tersebut</li>
            <li>Verifikasi kondisi aset dan upload foto jika diperlukan</li>
            <li>Selesaikan sesi untuk melihat ringkasan hasil</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
