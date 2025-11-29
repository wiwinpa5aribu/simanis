import * as argon2 from 'argon2';

/**
 * Password service menggunakan Argon2 untuk hashing
 */
export class PasswordService {
  /**
   * Hash password menggunakan Argon2
   */
  async hash(password: string): Promise<string> {
    try {
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 4,
      });
      return hash;
    } catch (error) {
      throw new Error(`Failed to hash password: ${error}`);
    }
  }

  /**
   * Verify password against hash
   */
  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      throw new Error(`Failed to verify password: ${error}`);
    }
  }
}

// Export singleton instance
export const passwordService = new PasswordService();
