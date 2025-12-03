/**
 * Komponen AuditDetailDrawer
 *
 * Menampilkan detail perubahan dari audit log dalam format yang mudah dibaca
 */

import { formatDistanceToNow } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AuditLog } from '@/libs/api/audit'

interface AuditDetailDrawerProps {
  auditLog: AuditLog | null
  isOpen: boolean
  onClose: () => void
}

export function AuditDetailDrawer({
  auditLog,
  isOpen,
  onClose,
}: AuditDetailDrawerProps) {
  if (!isOpen || !auditLog) return null

  // Helper untuk format value dengan type-safe
  // Menggunakan unknown karena value bisa berbagai tipe dari audit log
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  const renderFieldChanges = () => {
    if (
      !auditLog.field_changed ||
      Object.keys(auditLog.field_changed).length === 0
    ) {
      return (
        <p className="text-gray-500 text-sm">
          Tidak ada detail perubahan yang tersedia
        </p>
      )
    }

    return (
      <div className="space-y-4">
        {Object.entries(auditLog.field_changed).map(([field, change]) => {
          const changeObj = change as
            | { old?: unknown; new?: unknown }
            | undefined
          return (
            <div key={field} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">{field}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Nilai Lama:</p>
                  <pre className="bg-red-50 text-red-900 p-2 rounded border border-red-200 overflow-auto">
                    {formatValue(
                      changeObj?.old || auditLog.old_values?.[field]
                    )}
                  </pre>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Nilai Baru:</p>
                  <pre className="bg-green-50 text-green-900 p-2 rounded border border-green-200 overflow-auto">
                    {formatValue(
                      changeObj?.new || auditLog.new_values?.[field]
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Detail Audit Log
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                #{auditLog.id} •{' '}
                {formatDistanceToNow(new Date(auditLog.timestamp), {
                  addSuffix: true,
                  locale: localeId,
                })}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">Tipe Entitas</dt>
                  <dd className="mt-1 text-gray-900">{auditLog.entity_type}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">ID Entitas</dt>
                  <dd className="mt-1 text-gray-900">{auditLog.entity_id}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">User</dt>
                  <dd className="mt-1 text-gray-900">
                    {auditLog.user_name || `User #${auditLog.user_id}` || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Aksi</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        auditLog.action === 'create'
                          ? 'bg-green-100 text-green-800'
                          : auditLog.action === 'update'
                            ? 'bg-blue-100 text-blue-800'
                            : auditLog.action === 'delete'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {auditLog.action}
                    </span>
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Waktu</dt>
                  <dd className="mt-1 text-gray-900">
                    {new Date(auditLog.timestamp).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'long',
                    })}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Changes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Perubahan</CardTitle>
            </CardHeader>
            <CardContent>{renderFieldChanges()}</CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
