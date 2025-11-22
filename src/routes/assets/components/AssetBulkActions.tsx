import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, X } from 'lucide-react'
import { updateAsset } from '@/libs/api/assets'
import { ASSET_CONDITIONS } from '@/libs/validation/assetSchemas'
import { showSuccessToast } from '@/libs/ui/toast'

interface AssetBulkActionsProps {
  selectedIds: number[]
  onClearSelection: () => void
}

export function AssetBulkActions({
  selectedIds,
  onClearSelection,
}: AssetBulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [actionType, setActionType] = useState<'condition' | null>(null)
  const [targetCondition, setTargetCondition] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    success: 0,
    failed: 0,
  })

  const queryClient = useQueryClient()

  const handleOpenConditionDialog = () => {
    setActionType('condition')
    setTargetCondition('')
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isProcessing) return // Prevent closing while processing
    setIsOpen(false)
    setActionType(null)
    setProgress({ current: 0, total: 0, success: 0, failed: 0 })
  }

  const executeBulkUpdate = async () => {
    if (actionType === 'condition' && !targetCondition) return

    setIsProcessing(true)
    setProgress({
      current: 0,
      total: selectedIds.length,
      success: 0,
      failed: 0,
    })

    const updates =
      actionType === 'condition' ? { kondisi: targetCondition } : {}

    let successCount = 0
    let failedCount = 0

    // Sequential execution for now (mocking bulk via loop)
    for (let i = 0; i < selectedIds.length; i++) {
      const id = selectedIds[i]
      try {
        await updateAsset(id, updates as any)
        successCount++
      } catch (error) {
        console.error(`Failed to update asset ${id}`, error)
        failedCount++
      }

      setProgress((prev) => ({
        ...prev,
        current: i + 1,
        success: successCount,
        failed: failedCount,
      }))
    }

    setIsProcessing(false)
    queryClient.invalidateQueries({ queryKey: ['assets'] })

    // Show summary using toast
    if (failedCount === 0) {
      showSuccessToast(`Berhasil memperbarui ${successCount} aset.`)
    } else {
      showSuccessToast(
        `Selesai. Berhasil: ${successCount}, Gagal: ${failedCount}`
      )
    }

    if (successCount === selectedIds.length) {
      onClearSelection()
      handleClose()
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border shadow-lg rounded-lg px-6 py-4 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="font-medium">{selectedIds.length}</span>
        <span className="text-gray-500 text-sm">aset terpilih</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleOpenConditionDialog}>
          Ubah Kondisi
        </Button>
        {/* Add more bulk actions here */}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="ml-2 h-8 w-8"
        onClick={onClearSelection}
      >
        <X className="h-4 w-4" />
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => !isProcessing && !open && handleClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Kondisi Massal</DialogTitle>
            <DialogDescription>
              Tindakan ini akan mengubah kondisi untuk {selectedIds.length} aset
              yang dipilih.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="condition">Pilih Kondisi Baru</Label>
            <Select
              value={targetCondition}
              onValueChange={setTargetCondition}
              disabled={isProcessing}
            >
              <SelectTrigger id="condition" className="mt-2">
                <SelectValue placeholder="Pilih kondisi..." />
              </SelectTrigger>
              <SelectContent>
                {ASSET_CONDITIONS.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Memproses...</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button
              onClick={executeBulkUpdate}
              disabled={!targetCondition || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses
                </>
              ) : (
                'Terapkan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
