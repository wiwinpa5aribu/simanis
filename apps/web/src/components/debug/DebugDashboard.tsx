/**
 * Debugging Dashboard
 *
 * Visual dashboard untuk melihat "kesehatan" sistem
 * Menampilkan status modul, error tracking, dan performance metrics
 */

import { useEffect, useState } from 'react'
import type { ModuleInfo, SystemHealth } from '@simanis/shared/core'
import { ModuleRegistry } from '@simanis/shared/core'

interface DebugDashboardProps {
  /** Show in compact mode */
  compact?: boolean
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number
}

export function DebugDashboard({
  compact = false,
  refreshInterval = 5000,
}: DebugDashboardProps) {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [modules, setModules] = useState<ModuleInfo[]>([])

  useEffect(() => {
    const updateHealth = () => {
      setHealth(ModuleRegistry.getSystemHealth())
      setModules(ModuleRegistry.listModules())
    }

    updateHealth()

    if (refreshInterval > 0) {
      const interval = setInterval(updateHealth, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  if (!health) {
    return <div className="p-4 text-gray-500">Loading...</div>
  }

  if (compact) {
    return <CompactView health={health} modules={modules} />
  }

  return <FullView health={health} modules={modules} />
}

// ============================================
// COMPACT VIEW
// ============================================

function CompactView({
  health,
  modules,
}: {
  health: SystemHealth
  modules: ModuleInfo[]
}) {
  const statusColor = getStatusColor(health.status)

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm">
      <div className={`h-2 w-2 rounded-full ${statusColor}`} />
      <span className="font-medium">{health.status}</span>
      <span className="text-gray-500">|</span>
      <span>{modules.length} modules</span>
      {health.errorCount > 0 && (
        <>
          <span className="text-gray-500">|</span>
          <span className="text-red-600">{health.errorCount} errors</span>
        </>
      )}
    </div>
  )
}

// ============================================
// FULL VIEW
// ============================================

function FullView({
  health,
  modules,
}: {
  health: SystemHealth
  modules: ModuleInfo[]
}) {
  return (
    <div className="space-y-6 rounded-lg border bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Health Dashboard</h2>
        <StatusBadge status={health.status} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          label="Total Modules"
          value={health.totalModules}
          icon="📦"
        />
        <SummaryCard
          label="Healthy"
          value={health.healthyModules}
          icon="✅"
          variant="success"
        />
        <SummaryCard
          label="Degraded"
          value={health.degradedModules}
          icon="⚠️"
          variant="warning"
        />
        <SummaryCard
          label="Errors"
          value={health.errorCount}
          icon="❌"
          variant={health.errorCount > 0 ? 'error' : 'default'}
        />
      </div>

      {/* Module List */}
      <div>
        <h3 className="mb-3 font-medium">Registered Modules</h3>
        {modules.length === 0 ? (
          <p className="text-gray-500">No modules registered yet</p>
        ) : (
          <div className="space-y-2">
            {modules.map((module) => (
              <ModuleCard key={module.name} module={module} />
            ))}
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="text-right text-xs text-gray-400">
        Last updated: {new Date(health.lastCheck).toLocaleTimeString()}
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatusBadge({ status }: { status: SystemHealth['status'] }) {
  const colors = {
    healthy: 'bg-green-100 text-green-800',
    degraded: 'bg-yellow-100 text-yellow-800',
    unhealthy: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  variant = 'default',
}: {
  label: string
  value: number
  icon: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}) {
  const variants = {
    default: 'bg-gray-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    error: 'bg-red-50',
  }

  return (
    <div className={`rounded-lg p-4 ${variants[variant]}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({ module }: { module: ModuleInfo }) {
  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    error: 'bg-red-500',
    initializing: 'bg-blue-500',
  }

  const layerColors = {
    presentation: 'bg-purple-100 text-purple-800',
    application: 'bg-blue-100 text-blue-800',
    domain: 'bg-green-100 text-green-800',
    infrastructure: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${statusColors[module.status]}`} />
        <div>
          <div className="font-medium">{module.name}</div>
          <div className="text-xs text-gray-500">v{module.version}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {module.layer && (
          <span
            className={`rounded px-2 py-0.5 text-xs ${layerColors[module.layer] ?? 'bg-gray-100'}`}
          >
            {module.layer}
          </span>
        )}
        {module.errorCount > 0 && (
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
            {module.errorCount} errors
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// HELPERS
// ============================================

function getStatusColor(status: SystemHealth['status']): string {
  switch (status) {
    case 'healthy':
      return 'bg-green-500'
    case 'degraded':
      return 'bg-yellow-500'
    case 'unhealthy':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export default DebugDashboard
