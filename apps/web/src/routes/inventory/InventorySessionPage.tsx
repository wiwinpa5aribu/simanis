/**
 * =====================================================
 * HALAMAN DETAIL SESI INVENTARISASI
 * =====================================================
 *
 * Menampilkan detail sesi inventarisasi beserta hasil pengecekan
 *
 * Fitur:
 * - Lihat info sesi (lokasi, petugas, status, tanggal)
 * - Lihat ringkasan (total dicek, bermasalah, belum dicek)
 * - Lihat daftar hasil pengecekan
 * - Aksi: Lanjutkan scan, Selesaikan, Batalkan, Download laporan
 *
 * @author SIMANIS Team
 * @version 1.0.0
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileText,
  Loader2,
  MapPin,
  QrCode,
  User,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
// Komponen UI
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
// API dan Types
import {
  batalkanSesi,
  downloadLaporan,
  getDetailSesi,
  selesaikanSesi,
} from '@/libs/api/inventorySessions'
import { type KondisiAset, ROUTES } from '@/libs/constants'
import type { HasilPengecekan } from '@/libs/types'
import { logger } from '@/libs/utils/logger'

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'berlangsung':
      return (
        <Badge variant="default" className="bg-blue-500">
          <Clock className="mr-1 h-3 w-3" />
          Berlangsung
        </Badge>
      )
    case 'selesai':
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Selesai
        </Badge>
      )
    case 'dibatalkan':
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Dibatalkan
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getKondisiBadge = (kondisi: KondisiAset) => {
  switch (kondisi) {
    case 'baik':
      return <Badge className="bg-green-100 text-green-800">Baik</Badge>
    case 'rusak_ringan':
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Rusak Ringan</Badge>
      )
    case 'rusak_berat':
      return (
        <Badge className="bg-orange-100 text-orange-800">Rusak Berat</Badge>
      )
    case 'hilang':
      return <Badge className="bg-red-100 text-red-800">Hilang</Badge>
    default:
      return <Badge variant="secondary">{kondisi}</Badge>
  }
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function InventorySessionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sessionId = Number.parseInt(id || '0')

  // State untuk dialog
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [alasanBatal, setAlasanBatal] = useState('')

  // ============================================================
  // DATA FETCHING
  // ============================================================

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['inventory-session', sessionId],
    queryFn: () => getDetailSesi(sessionId),
    enabled: sessionId > 0,
  })

  // ============================================================
  // MUTATIONS
  // ============================================================

  const completeMutation = useMutation({
    mutationFn: (konfirmasi: boolean) => selesaikanSesi(sessionId, konfirmasi),
    onSuccess: () => {
      toast.success('Sesi Selesai', {
        description: 'Sesi inventarisasi berhasil diselesaikan',
      })
      queryClient.invalidateQueries({
        queryKey: ['inventory-session', sessionId],
      })
      setShowCompleteDialog(false)
    },
    onError: (error) => {
      toast.error('Gagal Menyelesaikan Sesi', {
        description:
          error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: () => batalkanSesi(sessionId, alasanBatal),
    onSuccess: () => {
      toast.success('Sesi Dibatalkan', {
        description: 'Sesi inventarisasi berhasil dibatalkan',
      })
      queryClient.invalidateQueries({
        queryKey: ['inventory-session', sessionId],
      })
      setShowCancelDialog(false)
      setAlasanBatal('')
    },
    onError: (error) => {
      toast.error('Gagal Membatalkan Sesi', {
        description:
          error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
    },
  })

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  const handleKembali = () => navigate(ROUTES.INVENTORY.LIST)

  const handleLanjutkanScan = () => {
    if (detail?.sesi) {
      navigate(ROUTES.INVENTORY.SCAN(sessionId))
    }
  }

  const handleDownloadLaporan = async (format: 'pdf' | 'excel') => {
    try {
      logger.info('InventorySessionPage', 'Download laporan', { format })
      const blob = await downloadLaporan(sessionId, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `laporan-inventarisasi-${sessionId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Laporan berhasil didownload')
    } catch (error) {
      toast.error('Gagal download laporan')
      logger.error('InventorySessionPage', 'Gagal download laporan', error)
    }
  }

  // ============================================================
  // RENDER: LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // ============================================================
  // RENDER: ERROR STATE
  // ============================================================

  if (error || !detail) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Sesi Tidak Ditemukan</h3>
                <p className="text-sm">
                  Sesi inventarisasi dengan ID {sessionId} tidak ditemukan.
                </p>
              </div>
            </div>
            <Button variant="outline" className="mt-4" onClick={handleKembali}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { sesi, hasilPengecekan, ringkasan } = detail
  const isBerlangsung = sesi.status === 'berlangsung'

  // ============================================================
  // RENDER: MAIN CONTENT
  // ============================================================

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleKembali}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Sesi Inventarisasi
            </h1>
            <p className="text-gray-500">ID: {sesi.id}</p>
          </div>
        </div>
        {getStatusBadge(sesi.status)}
      </div>

      {/* Info Sesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Informasi Sesi
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Lokasi</p>
              <p className="font-medium">{sesi.lokasiNama}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Petugas</p>
              <p className="font-medium">{sesi.petugasNama}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Tanggal Mulai</p>
              <p className="font-medium">
                {format(new Date(sesi.tanggalMulai), 'dd MMMM yyyy, HH:mm', {
                  locale: localeId,
                })}
              </p>
            </div>
          </div>
          {sesi.tanggalSelesai && (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tanggal Selesai</p>
                <p className="font-medium">
                  {format(
                    new Date(sesi.tanggalSelesai),
                    'dd MMMM yyyy, HH:mm',
                    {
                      locale: localeId,
                    }
                  )}
                </p>
              </div>
            </div>
          )}
          {sesi.catatan && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Catatan</p>
              <p className="font-medium">{sesi.catatan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ringkasan */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {ringkasan.totalAsetDiLokasi}
              </p>
              <p className="text-sm text-gray-500">Total Aset</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {ringkasan.totalDicek}
              </p>
              <p className="text-sm text-gray-500">Sudah Dicek</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {ringkasan.totalBelumDicek}
              </p>
              <p className="text-sm text-gray-500">Belum Dicek</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {ringkasan.totalKondisiBerubah + ringkasan.totalHilang}
              </p>
              <p className="text-sm text-gray-500">Bermasalah</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aksi */}
      {isBerlangsung && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleLanjutkanScan}>
                <QrCode className="mr-2 h-4 w-4" />
                Lanjutkan Scan
              </Button>
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => setShowCompleteDialog(true)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Selesaikan Sesi
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => setShowCancelDialog(true)}
              >
                <Ban className="mr-2 h-4 w-4" />
                Batalkan Sesi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Laporan (jika selesai) */}
      {sesi.status === 'selesai' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => handleDownloadLaporan('pdf')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownloadLaporan('excel')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daftar Hasil Pengecekan */}
      <Card>
        <CardHeader>
          <CardTitle>Hasil Pengecekan</CardTitle>
          <CardDescription>
            {hasilPengecekan.length} aset sudah dicek
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasilPengecekan.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClipboardCheck className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">Belum ada aset yang dicek</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Aset</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kondisi Sebelum</TableHead>
                    <TableHead>Kondisi Sesudah</TableHead>
                    <TableHead>Waktu Cek</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hasilPengecekan.map((hasil: HasilPengecekan) => (
                    <TableRow
                      key={hasil.id}
                      className={hasil.kondisiBerubah ? 'bg-yellow-50' : ''}
                    >
                      <TableCell className="font-medium">
                        {hasil.kodeAset}
                      </TableCell>
                      <TableCell>{hasil.namaBarang}</TableCell>
                      <TableCell>
                        {getKondisiBadge(hasil.kondisiSebelum)}
                      </TableCell>
                      <TableCell>
                        {getKondisiBadge(hasil.kondisiSesudah)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(hasil.dicekPada), 'dd/MM/yyyy HH:mm', {
                          locale: localeId,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Selesaikan Sesi */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selesaikan Sesi Inventarisasi?</DialogTitle>
            <DialogDescription>
              {ringkasan.totalBelumDicek > 0 ? (
                <span className="text-yellow-600">
                  Masih ada {ringkasan.totalBelumDicek} aset yang belum dicek.
                  Apakah Anda yakin ingin menyelesaikan sesi ini?
                </span>
              ) : (
                'Semua aset sudah dicek. Selesaikan sesi inventarisasi?'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCompleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              onClick={() =>
                completeMutation.mutate(ringkasan.totalBelumDicek > 0)
              }
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Selesaikan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Batalkan Sesi */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batalkan Sesi Inventarisasi?</DialogTitle>
            <DialogDescription>
              Sesi yang dibatalkan tidak dapat dilanjutkan. Masukkan alasan
              pembatalan.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Alasan pembatalan..."
            value={alasanBatal}
            onChange={(e) => setAlasanBatal(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Kembali
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending || !alasanBatal.trim()}
            >
              {cancelMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Ban className="mr-2 h-4 w-4" />
              )}
              Batalkan Sesi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
