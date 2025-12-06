/**
 * Hash Utilities
 *
 * Simple hash functions for data integrity checking
 * Uses a fast, non-cryptographic hash for performance
 */

/**
 * Create a simple hash from a string
 * Uses djb2 algorithm - fast and good distribution
 */
export function createHash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  // Convert to hex string
  return (hash >>> 0).toString(16).padStart(8, '0')
}

/**
 * Create a hash from an object
 */
export function hashObject(obj: unknown): string {
  return createHash(JSON.stringify(obj))
}

/**
 * Verify that data matches expected hash
 */
export function verifyHash(data: string, expectedHash: string): boolean {
  return createHash(data) === expectedHash
}

/**
 * Create a checksum for multiple values
 */
export function createChecksum(...values: unknown[]): string {
  const combined = values.map((v) => JSON.stringify(v)).join('|')
  return createHash(combined)
}
