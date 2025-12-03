'use strict'
// Re-export from generated Prisma client
// Generated to: node_modules/.prisma/client
Object.defineProperty(exports, '__esModule', { value: true })
exports.prisma = exports.Prisma = exports.PrismaClient = void 0
// Import from generated client location
const client_1 = require('.prisma/client')
Object.defineProperty(exports, 'PrismaClient', {
  enumerable: true,
  get: function () {
    return client_1.PrismaClient
  },
})
Object.defineProperty(exports, 'Prisma', {
  enumerable: true,
  get: function () {
    return client_1.Prisma
  },
})
// Create singleton instance
const globalForPrisma = globalThis
exports.prisma =
  globalForPrisma.prisma ??
  new client_1.PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = exports.prisma
