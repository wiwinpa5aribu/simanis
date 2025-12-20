import { describe, it, expect, vi, beforeEach } from "vitest"
import fc from "fast-check"
import { prisma } from "@/lib/db"
import { assetService } from "@/lib/services/asset-service"
import { userService } from "@/lib/services/user-service"

// Mock prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    asset: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    location: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    mutation: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}))

// Mock services that are used by actions
vi.mock("@/lib/services/asset-service", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/services/asset-service")>()
  return {
    ...original,
    assetService: {
      ...original.assetService,
      getById: vi.fn(),
    },
  }
})

vi.mock("@/lib/services/user-service", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/services/user-service")>()
  return {
    ...original,
    userService: {
      ...original.userService,
      checkEmailExists: vi.fn(),
    },
  }
})

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import { createAsset } from "../asset-actions"
import { createLocation } from "../location-actions"
import { createMutation } from "../mutation-actions"
import { createUser } from "../user-actions"

// Helper to create mock implementation that returns the data
const mockCreate = (mock: ReturnType<typeof vi.fn>) => {
  mock.mockImplementation((args: { data: Record<string, unknown> }) => Promise.resolve(args.data))
}

/**
 * Property Tests for Audit Log Creation
 * Feature: form-crud-implementation
 *
 * These tests verify:
 * - Property 3: Audit log creation on CRUD operations
 *
 * Validates: Requirements 1.4, 2.4, 3.4, 4.4, 5.1
 */

describe("Feature: form-crud-implementation, Property 3: Audit log creation on CRUD operations", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createAsset action", () => {
    it("should create audit log entry for any valid asset creation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,50}$/),
            category: fc.constantFrom("Elektronik", "Furnitur", "Perlengkapan", "Kendaraan"),
            location: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,50}$/),
            purchaseDate: fc.constant("2024-01-15"),
            purchasePrice: fc.nat({ max: 100000000 }),
            description: fc.string({ maxLength: 200 }),
          }),
          async (input) => {
            vi.clearAllMocks()

            // Setup mocks
            vi.mocked(prisma.asset.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.asset.create))
            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) =>
                Promise.resolve({ id: "LOG-001", ...args.data }) as any,
            )

            const result = await createAsset(input)

            // Verify success
            expect(result.success).toBe(true)

            // Verify audit log was created
            expect(prisma.auditLog.create).toHaveBeenCalledTimes(1)
            expect(prisma.auditLog.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                action: "CREATE",
                module: "Aset",
                user: expect.any(String),
                details: expect.stringContaining(input.name),
                timestamp: expect.any(String),
              }),
            })
          },
        ),
        { numRuns: 30 },
      )
    })

    it("should NOT create audit log when asset creation fails validation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.constant(""), // Invalid: empty name
            category: fc.string(),
            location: fc.string(),
            purchaseDate: fc.constant("2024-01-15"),
            purchasePrice: fc.nat(),
            description: fc.string(),
          }),
          async (input) => {
            vi.clearAllMocks()

            const result = await createAsset(input)

            // Verify failure
            expect(result.success).toBe(false)

            // Verify audit log was NOT created
            expect(prisma.auditLog.create).not.toHaveBeenCalled()
          },
        ),
        { numRuns: 20 },
      )
    })
  })

  describe("createLocation action", () => {
    it("should create audit log entry for any valid location creation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,50}$/),
            type: fc.constantFrom("gedung", "lantai", "ruangan"),
            parentId: fc.option(fc.stringMatching(/^LOC-\d{3}$/), { nil: undefined }),
          }),
          async (input) => {
            vi.clearAllMocks()

            // Setup mocks
            vi.mocked(prisma.location.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.location.create))
            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) =>
                Promise.resolve({ id: "LOG-001", ...args.data }) as any,
            )

            const result = await createLocation(input)

            // Verify success
            expect(result.success).toBe(true)

            // Verify audit log was created
            expect(prisma.auditLog.create).toHaveBeenCalledTimes(1)
            expect(prisma.auditLog.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                action: "CREATE",
                module: "Lokasi",
                user: expect.any(String),
                details: expect.stringContaining(input.name),
                timestamp: expect.any(String),
              }),
            })
          },
        ),
        { numRuns: 30 },
      )
    })

    it("should NOT create audit log when location creation fails validation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.constant(""), // Invalid: empty name
            type: fc.constantFrom("gedung", "lantai", "ruangan"),
          }),
          async (input) => {
            vi.clearAllMocks()

            const result = await createLocation(input)

            // Verify failure
            expect(result.success).toBe(false)

            // Verify audit log was NOT created
            expect(prisma.auditLog.create).not.toHaveBeenCalled()
          },
        ),
        { numRuns: 20 },
      )
    })
  })

  describe("createMutation action", () => {
    it("should create audit log entry for any valid mutation creation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc
            .tuple(
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
            )
            .filter(([from, to]) => from !== to),
          fc.stringMatching(/^AST-\d{4}$/),
          fc.constant("2024-01-15"),
          fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,30}$/),
          fc.string({ maxLength: 100 }),
          async ([fromLocation, toLocation], assetId, date, requester, notes) => {
            vi.clearAllMocks()

            const input = { assetId, fromLocation, toLocation, date, requester, notes }
            const mockAsset = {
              id: assetId,
              name: "Test Asset",
              category: "Elektronik",
              status: "aktif",
              location: fromLocation,
              purchaseDate: "2024-01-01",
              purchasePrice: 1000000,
              condition: "baik",
              description: "Test",
            }

            // Setup mocks - mock the service method directly
            vi.mocked(assetService.getById).mockResolvedValue(mockAsset as any)
            vi.mocked(prisma.mutation.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.mutation.create))
            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) =>
                Promise.resolve({ id: "LOG-001", ...args.data }) as any,
            )

            const result = await createMutation(input)

            // Verify success
            expect(result.success).toBe(true)

            // Verify audit log was created
            expect(prisma.auditLog.create).toHaveBeenCalledTimes(1)
            expect(prisma.auditLog.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                action: "CREATE",
                module: "Mutasi",
                user: expect.any(String),
                details: expect.stringContaining(fromLocation),
                timestamp: expect.any(String),
              }),
            })
          },
        ),
        { numRuns: 30 },
      )
    })

    it("should NOT create audit log when mutation has same source and destination", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
          fc.stringMatching(/^AST-\d{4}$/),
          fc.constant("2024-01-15"),
          fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,30}$/),
          async (sameLocation, assetId, date, requester) => {
            vi.clearAllMocks()

            const input = {
              assetId,
              fromLocation: sameLocation,
              toLocation: sameLocation, // Same as fromLocation - should fail validation
              date,
              requester,
              notes: "",
            }

            const result = await createMutation(input)

            // Verify failure
            expect(result.success).toBe(false)

            // Verify audit log was NOT created
            expect(prisma.auditLog.create).not.toHaveBeenCalled()
          },
        ),
        { numRuns: 20 },
      )
    })

    it("should NOT create audit log when asset not found", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc
            .tuple(
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
            )
            .filter(([from, to]) => from !== to),
          fc.stringMatching(/^AST-\d{4}$/),
          fc.constant("2024-01-15"),
          fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,30}$/),
          async ([fromLocation, toLocation], assetId, date, requester) => {
            vi.clearAllMocks()

            const input = { assetId, fromLocation, toLocation, date, requester, notes: "" }

            // Asset not found - mock the service method
            vi.mocked(assetService.getById).mockResolvedValue(null)

            const result = await createMutation(input)

            // Verify failure
            expect(result.success).toBe(false)
            expect(result.error).toContain("tidak ditemukan")

            // Verify audit log was NOT created
            expect(prisma.auditLog.create).not.toHaveBeenCalled()
          },
        ),
        { numRuns: 20 },
      )
    })
  })

  describe("createUser action", () => {
    it("should create audit log entry for any valid user creation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,50}$/),
            email: fc
              .tuple(
                fc.stringMatching(/^[a-z][a-z0-9]{2,10}$/),
                fc.stringMatching(/^[a-z]{2,10}$/),
                fc.constantFrom("com", "org", "edu", "id"),
              )
              .map(([local, domain, tld]) => `${local}@${domain}.${tld}`),
            password: fc.stringMatching(/^[a-zA-Z0-9]{6,20}$/),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          async (input) => {
            vi.clearAllMocks()

            // Setup mocks - use the mocked service method
            vi.mocked(userService.checkEmailExists).mockResolvedValue(false)
            vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.user.create))
            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) =>
                Promise.resolve({ id: "LOG-001", ...args.data }) as any,
            )

            const result = await createUser(input)

            // Verify success
            expect(result.success).toBe(true)

            // Verify audit log was created
            expect(prisma.auditLog.create).toHaveBeenCalledTimes(1)
            expect(prisma.auditLog.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                action: "CREATE",
                module: "Users",
                user: expect.any(String),
                details: expect.stringContaining(input.name),
                timestamp: expect.any(String),
              }),
            })
          },
        ),
        { numRuns: 30 },
      )
    })

    it("should NOT create audit log when email already exists", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,50}$/),
            email: fc
              .tuple(
                fc.stringMatching(/^[a-z][a-z0-9]{2,10}$/),
                fc.stringMatching(/^[a-z]{2,10}$/),
                fc.constantFrom("com", "org", "id"),
              )
              .map(([local, domain, tld]) => `${local}@${domain}.${tld}`),
            password: fc.stringMatching(/^[a-zA-Z0-9]{6,20}$/),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          async (input) => {
            vi.clearAllMocks()

            // Email already exists - use the mocked service method
            vi.mocked(userService.checkEmailExists).mockResolvedValue(true)

            const result = await createUser(input)

            // Verify failure
            expect(result.success).toBe(false)
            expect(result.error).toContain("sudah terdaftar")

            // Verify audit log was NOT created
            expect(prisma.auditLog.create).not.toHaveBeenCalled()
          },
        ),
        { numRuns: 20 },
      )
    })

    it("should NOT create audit log when user creation fails validation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,50}$/),
            email: fc.constant("invalid-email"), // Invalid email format
            password: fc.stringMatching(/^[a-zA-Z0-9]{6,20}$/),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          async (input) => {
            vi.clearAllMocks()

            const result = await createUser(input)

            // Verify failure
            expect(result.success).toBe(false)

            // Verify audit log was NOT created
            expect(prisma.auditLog.create).not.toHaveBeenCalled()
          },
        ),
        { numRuns: 20 },
      )
    })
  })

  describe("Audit log content verification", () => {
    it("should include correct action type for all CREATE operations", async () => {
      vi.clearAllMocks()

      // Setup common mocks
      vi.mocked(prisma.asset.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.location.findFirst).mockResolvedValue(null)
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
      vi.mocked(userService.checkEmailExists).mockResolvedValue(false)
      mockCreate(vi.mocked(prisma.asset.create))
      mockCreate(vi.mocked(prisma.location.create))
      mockCreate(vi.mocked(prisma.user.create))

      const auditLogs: Array<{ action: string; module: string }> = []
      vi.mocked(prisma.auditLog.create).mockImplementation(
        (args: { data: Record<string, unknown> }) => {
          auditLogs.push({
            action: args.data.action as string,
            module: args.data.module as string,
          })
          return Promise.resolve({ id: "LOG-001", ...args.data }) as any
        },
      )

      // Create asset
      await createAsset({
        name: "Test Asset",
        category: "Elektronik",
        location: "Ruang A",
        purchaseDate: "2024-01-15",
        purchasePrice: 1000000,
        description: "Test",
      })

      // Create location
      await createLocation({
        name: "Test Location",
        type: "ruangan",
      })

      // Create user
      await createUser({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "staff",
      })

      // Verify all audit logs have action "CREATE"
      expect(auditLogs).toHaveLength(3)
      expect(auditLogs.every((log) => log.action === "CREATE")).toBe(true)

      // Verify correct modules
      expect(auditLogs.map((log) => log.module)).toEqual(
        expect.arrayContaining(["Aset", "Lokasi", "Users"]),
      )
    })

    it("should include timestamp in ISO format for all audit logs", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
            category: fc.constantFrom("Elektronik", "Furnitur"),
            location: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
            purchaseDate: fc.constant("2024-01-15"),
            purchasePrice: fc.nat({ max: 10000000 }),
            description: fc.string({ maxLength: 50 }),
          }),
          async (input) => {
            vi.clearAllMocks()

            let capturedTimestamp: string | undefined

            vi.mocked(prisma.asset.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.asset.create))
            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) => {
                capturedTimestamp = args.data.timestamp as string
                return Promise.resolve({ id: "LOG-001", ...args.data }) as any
              },
            )

            await createAsset(input)

            // Verify timestamp is in ISO format
            expect(capturedTimestamp).toBeDefined()
            expect(capturedTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
          },
        ),
        { numRuns: 20 },
      )
    })
  })
})
