/**
 * Module Registry - Central Coordination System
 *
 * Registry untuk tracking semua modules dalam sistem.
 * Memungkinkan debugging dan monitoring kesehatan sistem.
 *
 * @example
 * // Register module
 * ModuleRegistry.register({
 *   name: 'AssetUseCase',
 *   version: '1.0.0',
 *   dependencies: ['AssetRepository', 'AuditLogService']
 * });
 *
 * // Check health
 * const health = ModuleRegistry.getSystemHealth();
 */

export type ModuleStatus = 'healthy' | 'degraded' | 'error' | 'unknown'

export interface ModuleInfo {
  name: string
  version: string
  description?: string
  dependencies?: string[]
  layer: 'presentation' | 'application' | 'persistence' | 'infrastructure'
}

export interface ModuleState {
  info: ModuleInfo
  status: ModuleStatus
  lastError?: {
    message: string
    timestamp: Date
    code?: string
  }
  metrics: {
    callCount: number
    errorCount: number
    lastCallAt?: Date
    avgDurationMs?: number
  }
  registeredAt: Date
}

export interface SystemHealth {
  status: ModuleStatus
  totalModules: number
  healthyModules: number
  degradedModules: number
  errorModules: number
  modules: Record<string, ModuleStatus>
  timestamp: Date
}

class ModuleRegistryImpl {
  private modules: Map<string, ModuleState> = new Map()
  private static instance: ModuleRegistryImpl

  private constructor() {}

  static getInstance(): ModuleRegistryImpl {
    if (!ModuleRegistryImpl.instance) {
      ModuleRegistryImpl.instance = new ModuleRegistryImpl()
    }
    return ModuleRegistryImpl.instance
  }

  /**
   * Register a module
   */
  register(info: ModuleInfo): void {
    if (this.modules.has(info.name)) {
      console.warn(`Module ${info.name} already registered, updating...`)
    }

    this.modules.set(info.name, {
      info,
      status: 'healthy',
      metrics: {
        callCount: 0,
        errorCount: 0,
      },
      registeredAt: new Date(),
    })
  }

  /**
   * Get module state
   */
  getModule(name: string): ModuleState | undefined {
    return this.modules.get(name)
  }

  /**
   * Update module status
   */
  updateStatus(name: string, status: ModuleStatus, error?: Error): void {
    const module = this.modules.get(name)
    if (!module) {
      console.warn(`Module ${name} not found in registry`)
      return
    }

    module.status = status
    if (error) {
      module.lastError = {
        message: error.message,
        timestamp: new Date(),
        code: (error as { code?: string }).code,
      }
      module.metrics.errorCount++
    }
  }

  /**
   * Record a module call (for metrics)
   */
  recordCall(name: string, durationMs: number, success: boolean): void {
    const module = this.modules.get(name)
    if (!module) return

    module.metrics.callCount++
    module.metrics.lastCallAt = new Date()

    if (!success) {
      module.metrics.errorCount++
    }

    // Update average duration
    const prevAvg = module.metrics.avgDurationMs || 0
    const prevCount = module.metrics.callCount - 1
    module.metrics.avgDurationMs =
      (prevAvg * prevCount + durationMs) / module.metrics.callCount
  }

  /**
   * Get system health overview
   */
  getSystemHealth(): SystemHealth {
    let healthyCount = 0
    let degradedCount = 0
    let errorCount = 0
    const moduleStatuses: Record<string, ModuleStatus> = {}

    for (const [name, state] of this.modules) {
      moduleStatuses[name] = state.status
      switch (state.status) {
        case 'healthy':
          healthyCount++
          break
        case 'degraded':
          degradedCount++
          break
        case 'error':
          errorCount++
          break
      }
    }

    // Determine overall status
    let overallStatus: ModuleStatus = 'healthy'
    if (errorCount > 0) {
      overallStatus = 'error'
    } else if (degradedCount > 0) {
      overallStatus = 'degraded'
    }

    return {
      status: overallStatus,
      totalModules: this.modules.size,
      healthyModules: healthyCount,
      degradedModules: degradedCount,
      errorModules: errorCount,
      modules: moduleStatuses,
      timestamp: new Date(),
    }
  }

  /**
   * Get all modules by layer
   */
  getModulesByLayer(
    layer: ModuleInfo['layer']
  ): Array<{ name: string; state: ModuleState }> {
    const result: Array<{ name: string; state: ModuleState }> = []
    for (const [name, state] of this.modules) {
      if (state.info.layer === layer) {
        result.push({ name, state })
      }
    }
    return result
  }

  /**
   * Check if all dependencies are registered
   */
  checkDependencies(moduleName: string): {
    satisfied: boolean
    missing: string[]
  } {
    const module = this.modules.get(moduleName)
    if (!module || !module.info.dependencies) {
      return { satisfied: true, missing: [] }
    }

    const missing = module.info.dependencies.filter(
      (dep) => !this.modules.has(dep)
    )

    return {
      satisfied: missing.length === 0,
      missing,
    }
  }

  /**
   * Get dependency graph for visualization
   */
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {}
    for (const [name, state] of this.modules) {
      graph[name] = state.info.dependencies || []
    }
    return graph
  }

  /**
   * Reset registry (for testing)
   */
  reset(): void {
    this.modules.clear()
  }

  /**
   * Export registry state (for debugging dashboard)
   */
  exportState(): Record<string, ModuleState> {
    const state: Record<string, ModuleState> = {}
    for (const [name, moduleState] of this.modules) {
      state[name] = moduleState
    }
    return state
  }
}

// Singleton export
export const ModuleRegistry = ModuleRegistryImpl.getInstance()

/**
 * Decorator-like function to wrap a module with registry tracking
 */
export function withModuleTracking<T extends (...args: unknown[]) => unknown>(
  moduleName: string,
  fn: T
): T {
  return ((...args: unknown[]) => {
    const start = performance.now()
    try {
      const result = fn(...args)

      // Handle async functions
      if (result instanceof Promise) {
        return result
          .then((value) => {
            ModuleRegistry.recordCall(
              moduleName,
              performance.now() - start,
              true
            )
            return value
          })
          .catch((error) => {
            ModuleRegistry.recordCall(
              moduleName,
              performance.now() - start,
              false
            )
            ModuleRegistry.updateStatus(moduleName, 'error', error)
            throw error
          })
      }

      ModuleRegistry.recordCall(moduleName, performance.now() - start, true)
      return result
    } catch (error) {
      ModuleRegistry.recordCall(moduleName, performance.now() - start, false)
      ModuleRegistry.updateStatus(
        moduleName,
        'error',
        error instanceof Error ? error : new Error(String(error))
      )
      throw error
    }
  }) as T
}
