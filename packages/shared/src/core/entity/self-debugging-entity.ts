/**
 * Self-Debugging Entity Types
 *
 * Implementasi dari konsep "Self-Debugging Data Design" di konsep ide.md
 * Setiap entity memiliki metadata lengkap untuk debugging:
 * - _metadata: version, hash, schema
 * - _lineage: created/modified tracking
 * - _audit_trail: complete change history
 * - _validation: validation status
 * - _sync: sync status
 * - _observability: access & error tracking
 */

// ============================================
// METADATA TYPES
// ============================================

export interface EntityMetadata {
  /** Version number, incremented on each change */
  version: number
  /** Hash of entity data for integrity check */
  hash: string
  /** Schema version used to create this entity */
  schemaVersion: string
  /** Timestamp of last hash calculation */
  hashCalculatedAt: string
}

// ============================================
// LINEAGE TYPES
// ============================================

export interface EntityLineage {
  /** ISO timestamp when entity was created */
  createdAt: string
  /** User ID who created the entity */
  createdBy: string
  /** Source of creation (web_form, api, import, etc.) */
  createdFrom: 'web_form' | 'api' | 'import' | 'migration' | 'system'
  /** ISO timestamp of last modification */
  lastModifiedAt: string
  /** User ID who last modified */
  lastModifiedBy: string
  /** Total number of modifications */
  modificationCount: number
  /** Source system identifier */
  sourceSystem: string
}

// ============================================
// AUDIT TRAIL TYPES
// ============================================

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'ARCHIVE'


export interface AuditChange {
  field: string
  oldValue: unknown
  newValue: unknown
  reason?: string
}

export interface AuditEntry {
  /** Version number at this point */
  version: number
  /** ISO timestamp of the action */
  timestamp: string
  /** User ID who performed the action */
  userId: string
  /** Username for display */
  userName?: string
  /** Type of action */
  action: AuditAction
  /** Changes made */
  changes: AuditChange[] | { initial: true }
  /** Client IP address */
  ip?: string
  /** User agent string */
  userAgent?: string
  /** Geographic location */
  location?: string
  /** Correlation ID for request tracing */
  correlationId?: string
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationStatus {
  /** ISO timestamp of last validation */
  lastValidated: string
  /** Version of validation rules used */
  validationRulesVersion: string
  /** List of passed validation rules */
  passedRules: string[]
  /** List of failed validation rules */
  failedRules: string[]
  /** Warnings (non-blocking issues) */
  warnings: string[]
  /** Is entity currently valid */
  isValid: boolean
}

// ============================================
// SYNC TYPES
// ============================================

export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error'

export interface SyncState {
  /** ISO timestamp of last successful sync */
  lastSynced: string | null
  /** Current sync status */
  syncStatus: SyncStatus
  /** Number of sync attempts */
  syncAttempts: number
  /** Local version number */
  localVersion: number
  /** Remote version number */
  remoteVersion: number
  /** Conflict resolution strategy used */
  conflictResolution: 'local_wins' | 'remote_wins' | 'manual' | null
  /** Last sync error message */
  lastError?: string
}


// ============================================
// OBSERVABILITY TYPES
// ============================================

export interface PerformanceFlags {
  /** Query took longer than threshold */
  slowQuery: boolean
  /** Entity accessed frequently */
  highTraffic: boolean
  /** Entity has large payload */
  largePayload: boolean
}

export interface ObservabilityData {
  /** Total error count for this entity */
  errorCount: number
  /** Last error details */
  lastError: {
    message: string
    code: string
    timestamp: string
    stack?: string
  } | null
  /** Total access count */
  accessCount: number
  /** ISO timestamp of last access */
  lastAccessed: string
  /** Performance indicators */
  performanceFlags: PerformanceFlags
}

// ============================================
// RELATIONSHIP TYPES
// ============================================

export interface EntityRelationships {
  /** Parent/owner relationships */
  belongsTo: Record<string, string>
  /** Child/owned relationships */
  hasMany: Record<string, string[]>
  /** Many-to-many relationships */
  manyToMany?: Record<string, string[]>
}

// ============================================
// SELF-DEBUGGING ENTITY
// ============================================

/**
 * Base interface for all self-debugging entities
 * Extends any domain entity with debugging capabilities
 */
export interface SelfDebuggingEntity<T = unknown> {
  /** The actual entity data */
  data: T
  /** Entity metadata for versioning and integrity */
  _metadata: EntityMetadata
  /** Creation and modification lineage */
  _lineage: EntityLineage
  /** Complete audit trail of all changes */
  _auditTrail: AuditEntry[]
  /** Validation status */
  _validation: ValidationStatus
  /** Sync status for offline-first */
  _sync: SyncState
  /** Entity relationships */
  _relationships: EntityRelationships
  /** Observability data */
  _observability: ObservabilityData
}


// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Create initial metadata for a new entity
 */
export function createEntityMetadata(schemaVersion: string): EntityMetadata {
  return {
    version: 1,
    hash: '',
    schemaVersion,
    hashCalculatedAt: new Date().toISOString(),
  }
}

/**
 * Create initial lineage for a new entity
 */
export function createEntityLineage(
  userId: string,
  source: EntityLineage['createdFrom'] = 'web_form',
): EntityLineage {
  const now = new Date().toISOString()
  return {
    createdAt: now,
    createdBy: userId,
    createdFrom: source,
    lastModifiedAt: now,
    lastModifiedBy: userId,
    modificationCount: 0,
    sourceSystem: 'simanis_pwa',
  }
}

/**
 * Create initial audit entry for entity creation
 */
export function createInitialAuditEntry(
  userId: string,
  userName?: string,
  context?: { ip?: string; userAgent?: string; correlationId?: string },
): AuditEntry {
  return {
    version: 1,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action: 'CREATE',
    changes: { initial: true },
    ip: context?.ip,
    userAgent: context?.userAgent,
    correlationId: context?.correlationId,
  }
}

/**
 * Create audit entry for an update
 */
export function createUpdateAuditEntry(
  version: number,
  userId: string,
  changes: AuditChange[],
  context?: {
    userName?: string
    ip?: string
    userAgent?: string
    correlationId?: string
  },
): AuditEntry {
  return {
    version,
    timestamp: new Date().toISOString(),
    userId,
    userName: context?.userName,
    action: 'UPDATE',
    changes,
    ip: context?.ip,
    userAgent: context?.userAgent,
    correlationId: context?.correlationId,
  }
}

/**
 * Create initial validation status
 */
export function createValidationStatus(
  rulesVersion = '1.0.0',
  passedRules: string[] = [],
): ValidationStatus {
  return {
    lastValidated: new Date().toISOString(),
    validationRulesVersion: rulesVersion,
    passedRules,
    failedRules: [],
    warnings: [],
    isValid: true,
  }
}

/**
 * Create initial sync state
 */
export function createSyncState(): SyncState {
  return {
    lastSynced: null,
    syncStatus: 'pending',
    syncAttempts: 0,
    localVersion: 1,
    remoteVersion: 0,
    conflictResolution: null,
  }
}

/**
 * Create initial observability data
 */
export function createObservabilityData(): ObservabilityData {
  return {
    errorCount: 0,
    lastError: null,
    accessCount: 0,
    lastAccessed: new Date().toISOString(),
    performanceFlags: {
      slowQuery: false,
      highTraffic: false,
      largePayload: false,
    },
  }
}

/**
 * Create a complete self-debugging entity wrapper
 */
export function createSelfDebuggingEntity<T>(
  data: T,
  userId: string,
  options?: {
    schemaVersion?: string
    validationRulesVersion?: string
    source?: EntityLineage['createdFrom']
    context?: {
      userName?: string
      ip?: string
      userAgent?: string
      correlationId?: string
    }
  },
): SelfDebuggingEntity<T> {
  const schemaVersion = options?.schemaVersion ?? '1.0.0'
  const validationRulesVersion = options?.validationRulesVersion ?? '1.0.0'
  const source = options?.source ?? 'web_form'

  return {
    data,
    _metadata: createEntityMetadata(schemaVersion),
    _lineage: createEntityLineage(userId, source),
    _auditTrail: [
      createInitialAuditEntry(
        userId,
        options?.context?.userName,
        options?.context,
      ),
    ],
    _validation: createValidationStatus(validationRulesVersion),
    _sync: createSyncState(),
    _relationships: {
      belongsTo: {},
      hasMany: {},
    },
    _observability: createObservabilityData(),
  }
}
