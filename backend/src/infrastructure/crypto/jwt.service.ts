import jwt from 'jsonwebtoken';
import { config } from '../../shared/config';

export interface JwtPayload {
    userId: number;
    username: string;
    roles: string[];
}

/**
 * JWT service untuk sign dan verify tokens
 */
export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = config.jwt.secret;
        this.expiresIn = config.jwt.expiresIn;
    }

    /**
     * Sign JWT token
     */
    sign(payload: JwtPayload): string {
        try {
            return jwt.sign(payload, this.secret, {
                expiresIn: this.expiresIn,
            });
        } catch (error) {
            throw new Error(`Failed to sign JWT: ${error}`);
        }
    }

    /**
     * Verify JWT token
     */
    verify(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, this.secret) as JwtPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            throw new Error(`Failed to verify JWT: ${error}`);
        }
    }

    /**
     * Decode JWT without verification (for debugging)
     */
    decode(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch (error) {
            return null;
        }
    }
}

// Export singleton instance
export const jwtService = new JwtService();
