import { Algorithm, hash, verify } from '@node-rs/argon2'

/**
 * Password service menggunakan Argon2 untuk hashing
 */
export class PasswordService {
  /**
   * Hash password menggunakan Argon2
   */
  async hash(password: string): Promise<string> {
    try {
      const hashedPassword = await hash(password, {
        algorithm: Algorithm.Argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 4,
      })
      return hashedPassword
    } catch (error) {
      throw new Error(`Failed to hash password: ${error}`)
    }
  }

  /**
   * Verify password against hash
   */
  async verify(hashedPassword: string, password: string): Promise<boolean> {
    try {
      return await verify(hashedPassword, password)
    } catch (error) {
      throw new Error(`Failed to verify password: ${error}`)
    }
  }
}

// Export singleton instance
export const passwordService = new PasswordService()
