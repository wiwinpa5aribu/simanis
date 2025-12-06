/**
 * Test Server Helper
 *
 * Provides a configured Fastify instance for integration testing
 * Uses fastify.inject() for in-process HTTP testing (no network overhead)
 */

import jwt from '@fastify/jwt'
import { PrismaClient } from '@simanis/database'
import Fastify, { FastifyInstance } from 'fastify'

// Test database client
export const testPrisma = new PrismaClient()

// Test user tokens (generated after seeding)
export interface TestUser {
  id: number
  username: string
  token: string
  role: string
}

export const testUsers: Map<string, TestUser> = new Map()

/**
 * Build a test server instance
 * This creates a minimal Fastify server with JWT support for testing
 */
export async function buildTestServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // Disable logging in tests
  })

  // Register JWT plugin with test secret
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'test-secret-key-for-testing-only',
  })

  // Add user decorator for auth
  app.decorateRequest('user', null)

  // Auth hook for protected routes
  app.addHook('onRequest', async (request) => {
    try {
      const authHeader = request.headers.authorization
      if (authHeader?.startsWith('Bearer ')) {
        const decoded = app.jwt.verify(authHeader.substring(7)) as {
          userId: number
          username: string
          roles: string[]
        }
        request.user = decoded
      }
    } catch {
      // Token invalid or missing - will be handled by route guards
    }
  })

  return app
}

/**
 * Generate a test JWT token for a user
 */
export function generateTestToken(
  app: FastifyInstance,
  userId: number,
  username: string,
  roles: string[] = ['Operator']
): string {
  return app.jwt.sign({ userId, username, roles }, { expiresIn: '1h' })
}

/**
 * Setup test users with tokens
 */
export async function setupTestUsers(app: FastifyInstance): Promise<void> {
  const users = await testPrisma.user.findMany({
    include: { roles: { include: { role: true } } },
  })

  for (const user of users) {
    const roles = user.roles.map((r) => r.role.name)
    const token = generateTestToken(app, user.id, user.username, roles)
    testUsers.set(user.username, {
      id: user.id,
      username: user.username,
      token,
      role: roles[0] || 'Unknown',
    })
  }
}

/**
 * Clean up test resources
 */
export async function cleanupTestServer(): Promise<void> {
  await testPrisma.$disconnect()
  testUsers.clear()
}

/**
 * Get authorization header for a test user
 */
export function getAuthHeader(
  username: string
): { authorization: string } | {} {
  const user = testUsers.get(username)
  if (!user) return {}
  return { authorization: `Bearer ${user.token}` }
}
