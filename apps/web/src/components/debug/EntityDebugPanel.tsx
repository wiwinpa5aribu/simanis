/**
 * Entity Debug Panel
 *
 * Panel untuk menampilkan debugging info dari Self-Debugging Entity
 * Berguna untuk melihat audit trail, validation status, sync status, dll
 */

import { useState } from 'react'
import type {
  AuditEntry,
  SyncState,
  ValidationStatus,
} from '@simanis/shared'
import { getDebuggingSummary } from '@simanis/shared'

// Entity type with debugging metadata
interface DebugEntity {
  _metadata: { version: number; schemaVersion: string }
  _lineage: { createdBy: string; createdAt: string; lastModifiedBy: string; lastModifiedAt: string; modificationCount: number }
  _auditTrail: AuditEntry[]
  _validation: ValidationStatus
  _sync: SyncState
  _observability: { errorCount: number; accessCount: number }
}

interface EntityDebugPanelProps {
  entity: DebugEntity
  title?: string
  defaultExpanded?: boolean
}

export function EntityDebugPanel({
  entity,
  title = 'Debug Info',
  defaultExpanded = false,
}: EntityDebugPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [activeTab, setActiveTab] = useState<'summary' | 'audit' | 'validation' | 'sync'>('summary')

  const summary = getDebuggingSummary(entity)

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 rounded border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        <span>🔍</span>
        <span>{title}</span>
        <span className="text-xs">v{summary.version}</span>
      </button>
    )
  }

  return (
    <div className="rounded-lg border bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <span>🔍</span>
          <span className="font-medium">{title}</span>
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs">v{summary.version}</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        {(['summary', 'audit', 'validation', 'sync'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'summary' && <SummaryTab summary={summary} />}
        {activeTab === 'audit' && <AuditTab auditTrail={entity._auditTrail} />}
        {activeTab === 'validation' && <ValidationTab validation={entity._validation} />}
        {activeTab === 'sync' && <SyncTab sync={entity._sync} />}
      </div>
    </div>
  )
}

// ============================================
// TAB COMPONENTS
// ============================================

function SummaryTab({ summary }: { summary: ReturnType<typeof getDebuggingSummary> }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <InfoRow label="Version" value={summary.version} />
      <InfoRow label="Created By" value={summary.createdBy} />
      <InfoRow label="Created At" value={formatDate(summary.createdAt)} />
      <InfoRow label="Last Modified By" value={summary.lastModifiedBy} />
      <InfoRow label="Last Modified At" value={formatDate(summary.lastModifiedAt)} />
      <InfoRow label="Modifications" value={summary.modificationCount} />
      <InfoRow
        label="Valid"
        value={summary.isValid ? '✅ Yes' : '❌ No'}
      />
      <InfoRow label="Sync Status" value={summary.syncStatus} />
      <InfoRow label="Error Count" value={summary.errorCount} />
      <InfoRow label="Access Count" value={summary.accessCount} />
      <InfoRow label="Age" value={`${summary.ageInDays} days`} />
    </div>
  )
}

function AuditTab({ auditTrail }: { auditTrail: AuditEntry[] }) {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {auditTrail.length === 0 ? (
        <p className="text-gray-500">No audit entries</p>
      ) : (
        [...auditTrail].reverse().map((entry, idx) => (
          <div key={`${entry.version}-${idx}`} className="rounded border bg-white p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ActionBadge action={entry.action} />
                <span className="text-xs text-gray-500">v{entry.version}</span>
              </div>
              <span className="text-xs text-gray-400">{formatDate(entry.timestamp)}</span>
            </div>
            <div className="text-xs text-gray-600">
              <span>By: {entry.userName ?? entry.userId}</span>
              {entry.ip && <span className="ml-2">IP: {entry.ip}</span>}
            </div>
            {Array.isArray(entry.changes) && entry.changes.length > 0 && (
              <div className="mt-2 space-y-1">
                {entry.changes.map((change, i) => (
                  <div key={i} className="text-xs bg-gray-50 rounded p-1">
                    <span className="font-medium">{change.field}:</span>{' '}
                    <span className="text-red-600">{String(change.oldValue)}</span>
                    {' → '}
                    <span className="text-green-600">{String(change.newValue)}</span>
                    {change.reason && (
                      <span className="text-gray-400 ml-1">({change.reason})</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function ValidationTab({
  validation,
}: {
  validation: ValidationStatus
}) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-2">
        <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
          {validation.isValid ? '✅ Valid' : '❌ Invalid'}
        </span>
        <span className="text-xs text-gray-400">
          Rules v{validation.validationRulesVersion}
        </span>
      </div>

      {validation.passedRules.length > 0 && (
        <div>
          <div className="font-medium text-green-700 mb-1">Passed Rules:</div>
          <div className="flex flex-wrap gap-1">
            {validation.passedRules.map((rule) => (
              <span key={rule} className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}

      {validation.failedRules.length > 0 && (
        <div>
          <div className="font-medium text-red-700 mb-1">Failed Rules:</div>
          <div className="flex flex-wrap gap-1">
            {validation.failedRules.map((rule) => (
              <span key={rule} className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                {rule}
              </span>
            ))}
          </div>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div>
          <div className="font-medium text-yellow-700 mb-1">Warnings:</div>
          <div className="flex flex-wrap gap-1">
            {validation.warnings.map((warning) => (
              <span
                key={warning}
                className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
              >
                {warning}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        Last validated: {formatDate(validation.lastValidated)}
      </div>
    </div>
  )
}

function SyncTab({ sync }: { sync: SelfDebuggingEntity<unknown>['_sync'] }) {
  const statusColors = {
    synced: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    conflict: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2">
        <span className={`rounded px-2 py-1 text-xs font-medium ${statusColors[sync.syncStatus]}`}>
          {sync.syncStatus.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <InfoRow label="Local Version" value={sync.localVersion} />
        <InfoRow label="Remote Version" value={sync.remoteVersion} />
        <InfoRow label="Sync Attempts" value={sync.syncAttempts} />
        <InfoRow
          label="Last Synced"
          value={sync.lastSynced ? formatDate(sync.lastSynced) : 'Never'}
        />
      </div>

      {sync.conflictResolution && (
        <div className="rounded bg-orange-50 p-2 text-xs">
          Conflict resolved using: <strong>{sync.conflictResolution}</strong>
        </div>
      )}

      {sync.lastError && (
        <div className="rounded bg-red-50 p-2 text-xs text-red-700">
          Error: {sync.lastError}
        </div>
      )}
    </div>
  )
}

// ============================================
// HELPER COMPONENTS
// ============================================

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>{' '}
      <span className="font-medium">{value}</span>
    </div>
  )
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    RESTORE: 'bg-purple-100 text-purple-800',
    ARCHIVE: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${colors[action] ?? 'bg-gray-100'}`}>
      {action}
    </span>
  )
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return isoString
  }
}

export default EntityDebugPanel
