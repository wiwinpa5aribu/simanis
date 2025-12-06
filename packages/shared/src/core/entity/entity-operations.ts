/**
 * Entity Operations
 *
 * Utility functions untuk manipulasi Self-Debugging Entities
 * dengan tracking otomatis untuk audit trail dan observability
 */

import { createHash } from '../defensive/hash'
import type {
  AuditChange,
  AuditEntry,
  SelfDebuggingEntity,
  SyncStatus,
  ValidationStatus,
} from './self-debugging-entity'
import { createUpdateAuditEntry } from './self-debugging-entity'

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update entity data with full audit tracking
 */
export function updateEntity<T extends Record<string, unknown>>(
  entity: SelfDebuggingEntity<T>,
  updates: Partial<T>,
  userId: string,
  reason?: string,
  context?: {
    userName?: string
    ip?: string
    userAgent?: string
    correlationId?: string
  },
): SelfDebuggingEntity<T> {
  const now = new Date().toISOString()
  const newVersion = entity._metadata.version + 1

  // Calculate changes
  const changes: AuditChange[] = []
  for (const [key, newValue] of Object.entries(updates)) {
    const oldValue = entity.data[key]
    if (oldValue !== newValue) {
      changes.push({
        field: key,
        oldValue,
        newValue,
        reason,
      })
    }
  }

  // If no actual changes, return original entity
  if (changes.length === 0) {
    return entity
  }

  // Create new audit entry
  const auditEntry = createUpdateAuditEntry(newVersion, userId, changes, context)

  // Merge data
  const newData = { ...entity.data, ...updates }

  return {
    ...entity,
    data: newData,
    _metadata: {
      ...entity._metadata,
      version: newVersion,
      hash: '', // Will be recalculated
      hashCalculatedAt: now,
    },
    _lineage: {
      ...entity._lineage,
      lastModifiedAt: now,
      lastModifiedBy: userId,
      modificationCount: entity._lineage.modificationCount + 1,
    },
    _auditTrail: [...entity._auditTrail, auditEntry],
    _sync: {
      ...entity._sync,
      syncStatus: 'pending',
      localVersion: newVersion,
    },
  }
}

/**
 * Record entity access for observability
 */
export function recordAccess<T>(
  entity: SelfDebuggingEntity<T>,
): SelfDebuggingEntity<T> {
  return {
    ...entity,
    _observability: {
      ...entity._observability,
      accessCount: entity._observability.accessCount + 1,
      lastAccessed: new Date().toISOString(),
    },
  }
}

/**
 * Record an error on the entity
 */
export function recordError<T>(
  entity: SelfDebuggingEntity<T>,
  error: { message: string; code: string; stack?: string },
): SelfDebuggingEntity<T> {
  return {
    ...entity,
    _observability: {
      ...entity._observability,
      errorCount: entity._observability.errorCount + 1,
      lastError: {
        ...error,
        timestamp: new Date().toISOString(),
      },
    },
  }
}

// ============================================
// VALIDATION OPERATIONS
// ============================================

/**
 * Update validation status
 */
export function updateValidation<T>(
  entity: SelfDebuggingEntity<T>,
  validation: Partial<ValidationStatus>,
): SelfDebuggingEntity<T> {
  return {
    ...entity,
    _validation: {
      ...entity._validation,
      ...validation,
      lastValidated: new Date().toISOString(),
    },
  }
}

/**
 * Mark entity as valid
 */
export function markValid<T>(
  entity: SelfDebuggingEntity<T>,
  passedRules: string[],
): SelfDebuggingEntity<T> {
  return updateValidation(entity, {
    isValid: true,
    passedRules,
    failedRules: [],
    warnings: [],
  })
}

/**
 * Mark entity as invalid
 */
export function markInvalid<T>(
  entity: SelfDebuggingEntity<T>,
  failedRules: string[],
  warnings: string[] = [],
): SelfDebuggingEntity<T> {
  return updateValidation(entity, {
    isValid: false,
    failedRules,
    warnings,
  })
}

// ============================================
// SYNC OPERATIONS
// ============================================

/**
 * Update sync status
 */
export function updateSyncStatus<T>(
  entity: SelfDebuggingEntity<T>,
  status: SyncStatus,
  remoteVersion?: number,
): SelfDebuggingEntity<T> {
  return {
    ...entity,
    _sync: {
      ...entity._sync,
      syncStatus: status,
      lastSynced: status === 'synced' ? new Date().toISOString() : entity._sync.lastSynced,
      syncAttempts: entity._sync.syncAttempts + 1,
      remoteVersion: remoteVersion ?? entity._sync.remoteVersion,
    },
  }
}

/**
 * Mark entity as synced
 */
export function markSynced<T>(
  entity: SelfDebuggingEntity<T>,
): SelfDebuggingEntity<T> {
  return updateSyncStatus(entity, 'synced', entity._metadata.version)
}

/**
 * Mark sync error
 */
export function markSyncError<T>(
  entity: SelfDebuggingEntity<T>,
  errorMessage: string,
): SelfDebuggingEntity<T> {
  return {
    ...entity,
    _sync: {
      ...entity._sync,
      syncStatus: 'error',
      syncAttempts: entity._sync.syncAttempts + 1,
      lastError: errorMessage,
    },
  }
}

// ============================================
// RELATIONSHIP OPERATIONS
// ============================================

/**
 * Set a belongs-to relationship
 */
export function setBelongsTo<T>(
  entity: SelfDebuggingEntity<T>,
  relationName: string,
  targetId: string,
): SelfDebuggingEntity<T> {
  return {
    ...entity,
    _relationships: {
      ...entity._relationships,
      belongsTo: {
        ...entity._relationships.belongsTo,
        [relationName]: targetId,
      },
    },
  }
}

/**
 * Add to a has-many relationship
 */
export function addHasMany<T>(
  entity: SelfDebuggingEntity<T>,
  relationName: string,
  targetId: string,
): SelfDebuggingEntity<T> {
  const existing = entity._relationships.hasMany[relationName] ?? []
  if (existing.includes(targetId)) {
    return entity
  }

  return {
    ...entity,
    _relationships: {
      ...entity._relationships,
      hasMany: {
        ...entity._relationships.hasMany,
        [relationName]: [...existing, targetId],
      },
    },
  }
}

/**
 * Remove from a has-many relationship
 */
export function removeHasMany<T>(
  entity: SelfDebuggingEntity<T>,
  relationName: string,
  targetId: string,
): SelfDebuggingEntity<T> {
  const existing = entity._relationships.hasMany[relationName] ?? []

  return {
    ...entity,
    _relationships: {
      ...entity._relationships,
      hasMany: {
        ...entity._relationships.hasMany,
        [relationName]: existing.filter((id) => id !== targetId),
      },
    },
  }
}

// ============================================
// HASH & INTEGRITY
// ============================================

/**
 * Calculate and update entity hash
 */
export function calculateHash<T>(
  entity: SelfDebuggingEntity<T>,
): SelfDebuggingEntity<T> {
  const hash = createHash(JSON.stringify(entity.data))

  return {
    ...entity,
    _metadata: {
      ...entity._metadata,
      hash,
      hashCalculatedAt: new Date().toISOString(),
    },
  }
}

/**
 * Verify entity integrity by comparing hash
 */
export function verifyIntegrity<T>(entity: SelfDebuggingEntity<T>): boolean {
  const currentHash = createHash(JSON.stringify(entity.data))
  return currentHash === entity._metadata.hash
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Get the last audit entry
 */
export function getLastAuditEntry<T>(
  entity: SelfDebuggingEntity<T>,
): AuditEntry | undefined {
  return entity._auditTrail[entity._auditTrail.length - 1]
}

/**
 * Get audit entries by user
 */
export function getAuditEntriesByUser<T>(
  entity: SelfDebuggingEntity<T>,
  userId: string,
): AuditEntry[] {
  return entity._auditTrail.filter((entry) => entry.userId === userId)
}

/**
 * Get audit entries in date range
 */
export function getAuditEntriesInRange<T>(
  entity: SelfDebuggingEntity<T>,
  startDate: Date,
  endDate: Date,
): AuditEntry[] {
  return entity._auditTrail.filter((entry) => {
    const entryDate = new Date(entry.timestamp)
    return entryDate >= startDate && entryDate <= endDate
  })
}

/**
 * Check if entity has been modified since a given date
 */
export function isModifiedSince<T>(
  entity: SelfDebuggingEntity<T>,
  date: Date,
): boolean {
  return new Date(entity._lineage.lastModifiedAt) > date
}

/**
 * Get entity age in days
 */
export function getEntityAge<T>(entity: SelfDebuggingEntity<T>): number {
  const created = new Date(entity._lineage.createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Generate debugging summary for an entity
 */
export function getDebuggingSummary<T>(entity: SelfDebuggingEntity<T>): {
  version: number
  createdBy: string
  createdAt: string
  lastModifiedBy: string
  lastModifiedAt: string
  modificationCount: number
  isValid: boolean
  syncStatus: string
  errorCount: number
  accessCount: number
  ageInDays: number
} {
  return {
    version: entity._metadata.version,
    createdBy: entity._lineage.createdBy,
    createdAt: entity._lineage.createdAt,
    lastModifiedBy: entity._lineage.lastModifiedBy,
    lastModifiedAt: entity._lineage.lastModifiedAt,
    modificationCount: entity._lineage.modificationCount,
    isValid: entity._validation.isValid,
    syncStatus: entity._sync.syncStatus,
    errorCount: entity._observability.errorCount,
    accessCount: entity._observability.accessCount,
    ageInDays: getEntityAge(entity),
  }
}
