import { describe, expect, it } from 'vitest'
import {
  addHasMany,
  calculateHash,
  createSelfDebuggingEntity,
  getDebuggingSummary,
  getLastAuditEntry,
  markInvalid,
  markSynced,
  markValid,
  recordAccess,
  recordError,
  removeHasMany,
  setBelongsTo,
  updateEntity,
  verifyIntegrity,
} from '../entity'

describe('Self-Debugging Entity', () => {
  const testData = {
    id: 'asset_001',
    name: 'Laptop Dell',
    value: 5000000,
    status: 'active',
  }

  describe('createSelfDebuggingEntity', () => {
    it('should create entity with all debugging metadata', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')

      expect(entity.data).toEqual(testData)
      expect(entity._metadata.version).toBe(1)
      expect(entity._metadata.schemaVersion).toBe('1.0.0')
      expect(entity._lineage.createdBy).toBe('user_001')
      expect(entity._lineage.modificationCount).toBe(0)
      expect(entity._auditTrail).toHaveLength(1)
      expect(entity._auditTrail[0].action).toBe('CREATE')
      expect(entity._validation.isValid).toBe(true)
      expect(entity._sync.syncStatus).toBe('pending')
      expect(entity._observability.errorCount).toBe(0)
    })

    it('should accept custom options', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001', {
        schemaVersion: '2.0.0',
        source: 'api',
        context: {
          userName: 'Admin',
          ip: '192.168.1.1',
          correlationId: 'corr-123',
        },
      })

      expect(entity._metadata.schemaVersion).toBe('2.0.0')
      expect(entity._lineage.createdFrom).toBe('api')
      expect(entity._auditTrail[0].userName).toBe('Admin')
      expect(entity._auditTrail[0].ip).toBe('192.168.1.1')
      expect(entity._auditTrail[0].correlationId).toBe('corr-123')
    })
  })

  describe('updateEntity', () => {
    it('should update data and track changes', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const updated = updateEntity(
        entity,
        { status: 'maintenance' },
        'user_002',
        'Scheduled maintenance',
      )

      expect(updated.data.status).toBe('maintenance')
      expect(updated._metadata.version).toBe(2)
      expect(updated._lineage.lastModifiedBy).toBe('user_002')
      expect(updated._lineage.modificationCount).toBe(1)
      expect(updated._auditTrail).toHaveLength(2)
      expect(updated._sync.syncStatus).toBe('pending')
    })

    it('should record field changes in audit trail', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const updated = updateEntity(
        entity,
        { value: 4500000 },
        'user_002',
        'Depreciation adjustment',
      )

      const lastAudit = getLastAuditEntry(updated)
      expect(lastAudit?.action).toBe('UPDATE')
      expect(lastAudit?.changes).toEqual([
        {
          field: 'value',
          oldValue: 5000000,
          newValue: 4500000,
          reason: 'Depreciation adjustment',
        },
      ])
    })

    it('should not create audit entry if no actual changes', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const updated = updateEntity(entity, { status: 'active' }, 'user_002')

      expect(updated._metadata.version).toBe(1)
      expect(updated._auditTrail).toHaveLength(1)
    })
  })

  describe('recordAccess', () => {
    it('should increment access count', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const accessed = recordAccess(entity)

      expect(accessed._observability.accessCount).toBe(1)
      expect(accessed._observability.lastAccessed).toBeDefined()
    })
  })

  describe('recordError', () => {
    it('should record error details', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const withError = recordError(entity, {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      })

      expect(withError._observability.errorCount).toBe(1)
      expect(withError._observability.lastError?.message).toBe('Validation failed')
      expect(withError._observability.lastError?.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('validation operations', () => {
    it('should mark entity as valid', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const valid = markValid(entity, ['required_fields', 'value_range'])

      expect(valid._validation.isValid).toBe(true)
      expect(valid._validation.passedRules).toEqual(['required_fields', 'value_range'])
    })

    it('should mark entity as invalid', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const invalid = markInvalid(entity, ['value_range'], ['deprecated_field'])

      expect(invalid._validation.isValid).toBe(false)
      expect(invalid._validation.failedRules).toEqual(['value_range'])
      expect(invalid._validation.warnings).toEqual(['deprecated_field'])
    })
  })

  describe('sync operations', () => {
    it('should mark entity as synced', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const synced = markSynced(entity)

      expect(synced._sync.syncStatus).toBe('synced')
      expect(synced._sync.lastSynced).toBeDefined()
      expect(synced._sync.remoteVersion).toBe(1)
    })
  })

  describe('relationship operations', () => {
    it('should set belongs-to relationship', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const withRelation = setBelongsTo(entity, 'room', 'room_lab_001')

      expect(withRelation._relationships.belongsTo.room).toBe('room_lab_001')
    })

    it('should add has-many relationship', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const withRelation = addHasMany(entity, 'maintenance_records', 'maint_001')
      const withMore = addHasMany(withRelation, 'maintenance_records', 'maint_002')

      expect(withMore._relationships.hasMany.maintenance_records).toEqual([
        'maint_001',
        'maint_002',
      ])
    })

    it('should not duplicate has-many entries', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const withRelation = addHasMany(entity, 'logs', 'log_001')
      const duplicate = addHasMany(withRelation, 'logs', 'log_001')

      expect(duplicate._relationships.hasMany.logs).toEqual(['log_001'])
    })

    it('should remove has-many relationship', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const withRelation = addHasMany(entity, 'logs', 'log_001')
      const withMore = addHasMany(withRelation, 'logs', 'log_002')
      const removed = removeHasMany(withMore, 'logs', 'log_001')

      expect(removed._relationships.hasMany.logs).toEqual(['log_002'])
    })
  })

  describe('hash & integrity', () => {
    it('should calculate and verify hash', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const hashed = calculateHash(entity)

      expect(hashed._metadata.hash).toBeDefined()
      expect(hashed._metadata.hash.length).toBeGreaterThan(0)
      expect(verifyIntegrity(hashed)).toBe(true)
    })

    it('should detect integrity violation', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const hashed = calculateHash(entity)

      // Tamper with data
      const tampered = {
        ...hashed,
        data: { ...hashed.data, value: 9999999 },
      }

      expect(verifyIntegrity(tampered)).toBe(false)
    })
  })

  describe('getDebuggingSummary', () => {
    it('should return complete debugging summary', () => {
      const entity = createSelfDebuggingEntity(testData, 'user_001')
      const updated = updateEntity(entity, { status: 'maintenance' }, 'user_002')
      const accessed = recordAccess(updated)
      const summary = getDebuggingSummary(accessed)

      expect(summary.version).toBe(2)
      expect(summary.createdBy).toBe('user_001')
      expect(summary.lastModifiedBy).toBe('user_002')
      expect(summary.modificationCount).toBe(1)
      expect(summary.isValid).toBe(true)
      expect(summary.syncStatus).toBe('pending')
      expect(summary.accessCount).toBe(1)
      expect(summary.ageInDays).toBeGreaterThanOrEqual(0)
    })
  })
})
