import { AlertTriangle, FileText, Loader2, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileUpload } from '@/components/uploads/FileUpload'

interface DeleteAssetDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (beritaAcaraFile: File) => Promise<void>
  assetName: string
  assetCode: string
  /** User role - only wakasek_sarpras and kepsek can delete */
  userRole?: string
}

/**
 * DeleteAssetDialog - Dialog konfirmasi hapus aset dengan upload Berita Acara
 *
 * Requirements:
 * - 5.1: Dialog konfirmasi dengan field upload Berita Acara
 * - 5.3: Permission check - hanya wakasek_sarpras dan kepsek
 * - 5.4: Berita Acara wajib untuk menghapus aset
 */
export function DeleteAssetDialog({
  isOpen,
  onClose,
  onConfirm,
  assetName,
  assetCode,
  userRole,
}: DeleteAssetDialogProps) {
  const [beritaAcaraFile, setBeritaAcaraFile] = useState<File | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user has permission to delete
  // userRole is now the resolved role key from usePermission (e.g., 'wakasek', 'kepsek', 'admin')
  const canDelete =
    userRole === 'wakasek' ||
    userRole === 'kepsek' ||
    userRole === 'admin'

  const handleFileUpload = (file: File) => {
    setBeritaAcaraFile(file)
    setError(null)
  }

  const handleConfirmDelete = async () => {
    if (!beritaAcaraFile) {
      setError('Berita Acara wajib diupload untuk menghapus aset')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      await onConfirm(beritaAcaraFile)
      // Reset state on success
      setBeritaAcaraFile(null)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Gagal menghapus aset. Coba lagi.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setBeritaAcaraFile(null)
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Hapus Aset
          </DialogTitle>
          <DialogDescription>
            Anda akan menghapus aset dari sistem. Tindakan ini tidak dapat
            dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Asset Info */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-sm text-gray-500 mb-1">
              Aset yang akan dihapus:
            </p>
            <p className="font-medium text-gray-900">{assetName}</p>
            <p className="text-sm font-mono text-gray-600">{assetCode}</p>
          </div>

          {/* Permission Check */}
          {!canDelete ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Anda tidak memiliki izin untuk menghapus aset. Hanya Wakasek
                Sarpras atau Kepala Sekolah yang dapat menghapus aset.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Berita Acara Upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4" />
                  <span>
                    Upload Berita Acara <span className="text-red-500">*</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Dokumen Berita Acara penghapusan aset wajib dilampirkan
                  sebagai bukti administratif.
                </p>
                <FileUpload
                  accept="application/pdf"
                  maxSizeMB={5}
                  onUpload={handleFileUpload}
                  label="Pilih file Berita Acara (PDF)"
                  disabled={isDeleting}
                />
              </div>

              {/* File Selected Indicator */}
              {beritaAcaraFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 flex-1 truncate">
                    {beritaAcaraFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBeritaAcaraFile(null)}
                    className="text-green-600 hover:text-green-800"
                    disabled={isDeleting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Aset akan ditandai sebagai &quot;Dihapus&quot; (soft delete)
                  dan tidak akan muncul di daftar aset aktif.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Batal
          </Button>
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting || !beritaAcaraFile}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Aset
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
