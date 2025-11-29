import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Loader2 } from 'lucide-react'
import { returnLoan } from '../../../libs/api/loans'
import { showSuccessToast, showErrorToast } from '../../../libs/ui/toast'
import { ASSET_CONDITIONS } from '../../../libs/validation/assetSchemas'
import type { LoanDetail } from '../../../libs/validation/loanSchemas'

interface LoanReturnModalProps {
  loan: LoanDetail
  isOpen: boolean
  onClose: () => void
}

interface ItemCondition {
  assetId: number
  conditionAfter: string
}

export function LoanReturnModal({
  loan,
  isOpen,
  onClose,
}: LoanReturnModalProps) {
  const queryClient = useQueryClient()
  const [returnDate, setReturnDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [itemConditions, setItemConditions] = useState<ItemCondition[]>(
    loan.items.map((item) => ({
      assetId: item.assetId,
      conditionAfter: item.conditionBefore, // Default to same condition
    }))
  )

  const returnMutation = useMutation({
    mutationFn: () => returnLoan(loan.id, returnDate),
    onSuccess: () => {
      showSuccessToast('Peminjaman berhasil dikembalikan')
      queryClient.invalidateQueries({ queryKey: ['loan', String(loan.id)] })
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      onClose()
    },
    onError: (error: Error) => {
      showErrorToast(error.message || 'Gagal memproses pengembalian')
    },
  })

  const handleConditionChange = (assetId: number, condition: string) => {
    setItemConditions((prev) =>
      prev.map((item) =>
        item.assetId === assetId ? { ...item, conditionAfter: condition } : item
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    returnMutation.mutate()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Proses Pengembalian
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Return Date */}
              <div>
                <label
                  htmlFor="return-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tanggal Pengembalian
                </label>
                <input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Item Conditions */}
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  Kondisi Aset Saat Dikembalikan
                </p>
                <div className="space-y-3">
                  {loan.items.map((item) => (
                    <div
                      key={item.assetId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.asset.namaBarang}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.asset.kodeAset}
                        </p>
                      </div>
                      <select
                        value={
                          itemConditions.find((c) => c.assetId === item.assetId)
                            ?.conditionAfter || item.conditionBefore
                        }
                        onChange={(e) =>
                          handleConditionChange(item.assetId, e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        {ASSET_CONDITIONS.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={returnMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {returnMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Konfirmasi Pengembalian'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
