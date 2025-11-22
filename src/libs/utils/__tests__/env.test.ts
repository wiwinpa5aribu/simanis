/**
 * Tests untuk Environment Utility
 */

import { describe, it, expect } from 'vitest'
import { env } from '../env'

describe('Environment Utility', () => {
  it('should have apiBaseUrl defined', () => {
    expect(env.apiBaseUrl).toBeDefined()
    expect(typeof env.apiBaseUrl).toBe('string')
  })

  it('should have apiTimeout as number', () => {
    expect(env.apiTimeout).toBeDefined()
    expect(typeof env.apiTimeout).toBe('number')
    expect(env.apiTimeout).toBeGreaterThan(0)
  })

  it('should have boolean feature flags', () => {
    expect(typeof env.useMockApi).toBe('boolean')
    expect(typeof env.enableLogging).toBe('boolean')
    expect(typeof env.pwaEnabled).toBe('boolean')
  })

  it('should have app configuration', () => {
    expect(env.appName).toBeDefined()
    expect(env.appVersion).toBeDefined()
    expect(typeof env.appName).toBe('string')
    expect(typeof env.appVersion).toBe('string')
  })

  it('should have environment mode', () => {
    expect(env.mode).toBeDefined()
    expect(typeof env.isDev).toBe('boolean')
    expect(typeof env.isProd).toBe('boolean')
  })
})
