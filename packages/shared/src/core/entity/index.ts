/**
 * Entity Module
 *
 * Self-Debugging Entity types and operations
 * Implements the "Self-Debugging Data Design" from konsep ide.md
 */

export {
  // Types
  type AuditAction,
  type AuditChange,
  type AuditEntry,
  type EntityLineage,
  type EntityMetadata,
  type EntityRelationships,
  type ObservabilityData,
  type PerformanceFlags,
  type SelfDebuggingEntity,
  type SyncState,
  type SyncStatus,
  type ValidationStatus,
  // Factory functions
  createEntityLineage,
  createEntityMetadata,
  createInitialAuditEntry,
  createObservabilityData,
  createSelfDebuggingEntity,
  createSyncState,
  createUpdateAuditEntry,
  createValidationStatus,
} from './self-debugging-entity'

export {
  // Update operations
  addHasMany,
  calculateHash,
  getAuditEntriesByUser,
  getAuditEntriesInRange,
  getDebuggingSummary,
  getEntityAge,
  getLastAuditEntry,
  isModifiedSince,
  markInvalid,
  markSynced,
  markSyncError,
  markValid,
  recordAccess,
  recordError,
  removeHasMany,
  setBelongsTo,
  updateEntity,
  updateSyncStatus,
  updateValidation,
  verifyIntegrity,
} from './entity-operations'
