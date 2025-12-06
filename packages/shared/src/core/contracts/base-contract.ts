/**
 * Base Contract - Foundation for all module contracts
 *
 * Contract mendefinisikan "kontrak" eksplisit antara modules.
 * Setiap module harus implement contract yang sesuai.
 */

import type { LogContext } from '../defensive/logger'
import type { Result, ResultError } from '../defensive/result'

/**
 * Base metadata untuk semua entities (Self-Debugging Data)
 */
export interface EntityMetadata {
  version: number
  dataHash: string
  schemaVersion: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Lineage tracking untuk audit trail
 */
export interface EntityLineage {
  createdBy: string
  createdFrom: 'web_form' | 'api' | 'import' | 'migration' | 'system'
  lastModifiedBy: string
  modificationCount: number
  sourceSystem: string
}

/**
 * Base entity dengan self-debugging capabilities
 */
export interface SelfDebuggingEntity {
  id: string
  _metadata: EntityMetadata
  _lineage: EntityLineage
}

/**
 * Execution context untuk setiap operasi
 */
export interface ExecutionContext {
  correlationId: string
  userId?: string
  userRole?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

/**
 * Base input untuk semua use cases
 */
export interface UseCaseInput {
  context: ExecutionContext
}

/**
 * Base output untuk semua use cases
 */
export interface UseCaseOutput<T> {
  data: T
  context: ExecutionContext
  duration: number
}

/**
 * Contract untuk Use Case
 */
export interface UseCase<TInput extends UseCaseInput, TOutput> {
  readonly name: string
  readonly version: string
  execute(input: TInput): Promise<Result<UseCaseOutput<TOutput>, ResultError>>
}

/**
 * Contract untuk Repository
 */
export interface Repository<TEntity, TId = string> {
  readonly name: string
  findById(id: TId): Promise<Result<TEntity | null, ResultError>>
  findAll(options?: PaginationOptions): Promise<Result<TEntity[], ResultError>>
  create(entity: Omit<TEntity, 'id'>): Promise<Result<TEntity, ResultError>>
  update(
    id: TId,
    entity: Partial<TEntity>
  ): Promise<Result<TEntity, ResultError>>
  delete(id: TId): Promise<Result<boolean, ResultError>>
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Event untuk event sourcing (future)
 */
export interface DomainEvent {
  eventId: string
  eventType: string
  aggregateId: string
  aggregateType: string
  payload: Record<string, unknown>
  metadata: {
    correlationId: string
    userId?: string
    timestamp: Date
    version: number
  }
}

/**
 * Health check contract
 */
export interface HealthCheckable {
  healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    details?: Record<string, unknown>
  }>
}
