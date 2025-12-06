/**
 * Core Module - Self-Debugging Code Ecosystem
 *
 * Foundation untuk contract-based module system dengan:
 * - Defensive programming patterns
 * - Module registry untuk tracking
 * - Explicit contracts untuk type safety
 *
 * @example
 * import { Result, Guard, createLogger, ModuleRegistry } from '@simanis/shared/core';
 *
 * // Register module
 * ModuleRegistry.register({
 *   name: 'AssetUseCase',
 *   version: '1.0.0',
 *   layer: 'application'
 * });
 *
 * // Use defensive patterns
 * const result = Guard.againstEmpty(name, 'name');
 * if (result.isErr()) return result;
 */

// Contracts
export {
  type AssetOutput,
  type CalculateDepreciationInput,
  type CalculateDepreciationUseCase,
  type CreateAssetInput,
  type CreateAssetUseCase,
  type CreateInventoryCheckInput,
  type CreateInventoryCheckUseCase,
  type CreateLoanInput,
  type CreateLoanUseCase,
  createExecutionContext,
  type DepreciationOutput,
  type DomainEvent,
  type EntityLineage,
  type EntityMetadata,
  type ExecutionContext,
  type GetAssetInput,
  type GetAssetUseCase,
  type HealthCheckable,
  type InventoryCheckOutput,
  type ListAssetsInput,
  type ListAssetsUseCase,
  type LoanOutput,
  type PaginatedResult,
  type PaginationOptions,
  type Repository,
  type SelfDebuggingEntity,
  type UseCase,
  type UseCaseInput,
  type UseCaseOutput,
} from './contracts'
// Defensive programming
export {
  type AsyncResult,
  combineResults,
  createLogger,
  Guard,
  type GuardResult,
  generateCorrelationId,
  type LogContext,
  type LogEntry,
  type Logger,
  type LogLevel,
  Result,
  type ResultError,
  SIMANISGuard,
  tryCatch,
} from './defensive'
// Module registry
export {
  type ModuleInfo,
  ModuleRegistry,
  type ModuleState,
  type ModuleStatus,
  type SystemHealth,
  withModuleTracking,
} from './registry'
