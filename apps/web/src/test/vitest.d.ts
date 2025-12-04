/**
 * Type definitions untuk Vitest dengan jest-dom matchers
 */

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import 'vitest'

declare module 'vitest' {
  // biome-ignore lint/suspicious/noExplicitAny: required for jest-dom matcher type extension
  interface Assertion<T = any>
    extends jest.Matchers<void>,
      TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    extends jest.Matchers<void>,
      // biome-ignore lint/suspicious/noExplicitAny: required for jest-dom matcher type extension
      TestingLibraryMatchers<any, void> {}
}
