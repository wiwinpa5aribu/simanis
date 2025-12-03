// Re-export from generated Prisma client
// Generated to: node_modules/.prisma/client

// Import from generated client location
import {
  Asset,
  AssetCategory,
  AssetDeletion,
  AssetDocument,
  AssetMutation,
  AuditLog,
  Building,
  DepreciationEntry,
  Floor,
  InventoryCheck,
  Loan,
  LoanItem,
  Prisma,
  PrismaClient,
  Role,
  Room,
  // Model types
  User,
  UserRole,
} from '.prisma/client'

// Re-export everything
export {
  PrismaClient,
  Prisma,
  // Model types
  User,
  Role,
  UserRole,
  AssetCategory,
  Building,
  Floor,
  Room,
  Asset,
  AssetDocument,
  AssetMutation,
  AssetDeletion,
  Loan,
  LoanItem,
  InventoryCheck,
  DepreciationEntry,
  AuditLog,
}

// Re-export all types
export type * from '.prisma/client'

// Create singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
