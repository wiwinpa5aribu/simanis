/**
 * Test Setup File
 *
 * Konfigurasi global untuk testing dengan Vitest
 */

import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect, vi } from 'vitest'

// Extend Vitest's expect dengan matchers dari jest-dom
expect.extend(matchers)

// Cleanup setelah setiap test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia (untuk responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver (untuk lazy loading)
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {
    // Parameters required by IntersectionObserver interface but not used in mock
  }

  disconnect(): void {
    // Mock implementation - no-op
  }
  observe(): void {
    // Mock implementation - no-op
  }
  unobserve(): void {
    // Mock implementation - no-op
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver
