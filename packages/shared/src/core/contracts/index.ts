/**
 * Contracts Module - All contract exports
 */

export {
  type DomainEvent,
  type EntityLineage,
  type EntityMetadata,
  type ExecutionContext,
  type HealthCheckable,
  type PaginatedResult,
  type PaginationOptions,
  type Repository,
  type SelfDebuggingEntity,
  type UseCase,
  type UseCaseInput,
  type UseCaseOutput,
} from './base-contract'

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
  type GetAssetInput,
  type GetAssetUseCase,
  type InventoryCheckOutput,
  type ListAssetsInput,
  type ListAssetsUseCase,
  type LoanOutput,
} from './use-case-contract'
