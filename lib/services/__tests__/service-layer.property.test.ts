import { describe, it, expect, vi, beforeEach } from "vitest"
import fc from "fast-check"
import { prisma } from "@/lib/db"

// Mock prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    asset: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    location: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    mutation: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    auditLog: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { assetService } from "../asset-service"
import { locationService } from "../location-service"
import { mutationService } from "../mutation-service"
import { userService } from "../user-service"
import { auditService } from "../audit-service"

// Helper to create mock implementation that returns the data
const mockCreate = (mock: ReturnType<typeof vi.fn>) => {
  mock.mockImplementation((args: { data: Record<string, unknown> }) => Promise.resolve(args.data))
}

/**
 * Property Tests for Service Layer
 * Feature: form-crud-implementation
 *
 * These tests verify:
 * - Property 1: Create operation persists data correctly
 * - Property 2: ID generation follows pattern and is unique
 * - Property 6: Default values are set correctly
 */

describe("Feature: form-crud-implementation, Property 1: Create operation persists data correctly", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("assetService.create", () => {
    it("should persist asset data correctly for any valid input", async () => {
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

            // Mock findFirst to return null (no existing asset)
            vi.mocked(prisma.asset.findFirst).mockResolvedValue(null)

            // Mock create to return the input with generated fields
            mockCreate(vi.mocked(prisma.asset.create))

            const result = await assetService.create(input)

            // Verify create was called with correct data
            expect(prisma.asset.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                name: input.name,
                category: input.category,
                location: input.location,
                purchaseDate: input.purchaseDate,
                purchasePrice: input.purchasePrice,
                description: input.description,
              }),
            })

            // Verify returned data matches input
            expect(result.name).toBe(input.name)
            expect(result.category).toBe(input.category)
            expect(result.location).toBe(input.location)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("locationService.create", () => {
    it("should persist location data correctly for any valid input", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,50}$/),
            type: fc.constantFrom("gedung", "lantai", "ruangan"),
            parentId: fc.option(fc.stringMatching(/^LOC-\d{3}$/), { nil: undefined }),
          }),
          async (input) => {
            vi.clearAllMocks()

            vi.mocked(prisma.location.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.location.create))

            const result = await locationService.create(input)

            expect(prisma.location.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                name: input.name,
                type: input.type,
              }),
            })

            expect(result.name).toBe(input.name)
            expect(result.type).toBe(input.type)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("userService.create", () => {
    it("should persist user data correctly for any valid input", async () => {
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

            vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.user.create))

            const result = await userService.create(input)

            expect(prisma.user.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                name: input.name,
                email: input.email,
                role: input.role,
              }),
            })

            expect(result.name).toBe(input.name)
            expect(result.email).toBe(input.email)
            expect(result.role).toBe(input.role)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("auditService.create", () => {
    it("should persist audit log data correctly for any valid input", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            user: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,50}$/),
            action: fc.constantFrom("CREATE", "UPDATE", "DELETE"),
            module: fc.constantFrom("Aset", "Lokasi", "Mutasi", "Users"),
            details: fc.stringMatching(/^[a-zA-Z0-9\s]{1,100}$/),
          }),
          async (input) => {
            vi.clearAllMocks()

            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) =>
                Promise.resolve({ id: "LOG-001", ...args.data }) as any,
            )

            const result = await auditService.create(input)

            expect(prisma.auditLog.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                user: input.user,
                action: input.action,
                module: input.module,
                details: input.details,
              }),
            })

            expect(result.user).toBe(input.user)
            expect(result.action).toBe(input.action)
            expect(result.module).toBe(input.module)
          },
        ),
        { numRuns: 50 },
      )
    })
  })
})

describe("Feature: form-crud-implementation, Property 2: ID generation follows pattern and is unique", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("assetService.generateId", () => {
    it("should generate IDs matching AST-XXXX pattern", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.nat({ max: 9998 }), // Max 9998 so next ID (9999) still fits 4 digits
          async (lastNum) => {
            vi.clearAllMocks()

            const mockLastAsset =
              lastNum > 0
                ? {
                    id: `AST-${String(lastNum).padStart(4, "0")}`,
                  }
                : null

            vi.mocked(prisma.asset.findFirst).mockResolvedValue(mockLastAsset as any)

            const newId = await assetService.generateId()

            // Verify pattern matches AST-XXXX
            expect(newId).toMatch(/^AST-\d{4}$/)

            // Verify it's incremented correctly
            const expectedNum = lastNum + 1
            expect(newId).toBe(`AST-${String(expectedNum).padStart(4, "0")}`)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should generate unique sequential IDs", async () => {
      const ids: string[] = []

      for (let i = 0; i < 10; i++) {
        vi.mocked(prisma.asset.findFirst).mockResolvedValue(
          i > 0 ? ({ id: ids[i - 1] } as any) : null,
        )

        const newId = await assetService.generateId()

        // Verify uniqueness
        expect(ids).not.toContain(newId)
        ids.push(newId)
      }

      // All IDs should be unique
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe("locationService.generateId", () => {
    it("should generate IDs matching LOC-XXX pattern", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.nat({ max: 998 }), // Max 998 so next ID (999) still fits 3 digits
          async (lastNum) => {
            vi.clearAllMocks()

            const mockLastLocation =
              lastNum > 0
                ? {
                    id: `LOC-${String(lastNum).padStart(3, "0")}`,
                  }
                : null

            vi.mocked(prisma.location.findFirst).mockResolvedValue(mockLastLocation as any)

            const newId = await locationService.generateId()

            expect(newId).toMatch(/^LOC-\d{3}$/)

            const expectedNum = lastNum + 1
            expect(newId).toBe(`LOC-${String(expectedNum).padStart(3, "0")}`)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("mutationService.generateId", () => {
    it("should generate IDs matching MUT-XXX pattern", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.nat({ max: 998 }), // Max 998 so next ID (999) still fits 3 digits
          async (lastNum) => {
            vi.clearAllMocks()

            const mockLastMutation =
              lastNum > 0
                ? {
                    id: `MUT-${String(lastNum).padStart(3, "0")}`,
                  }
                : null

            vi.mocked(prisma.mutation.findFirst).mockResolvedValue(mockLastMutation as any)

            const newId = await mutationService.generateId()

            expect(newId).toMatch(/^MUT-\d{3}$/)

            const expectedNum = lastNum + 1
            expect(newId).toBe(`MUT-${String(expectedNum).padStart(3, "0")}`)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("userService.generateId", () => {
    it("should generate IDs matching USR-XXX pattern", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.nat({ max: 998 }), // Max 998 so next ID (999) still fits 3 digits
          async (lastNum) => {
            vi.clearAllMocks()

            const mockLastUser =
              lastNum > 0
                ? {
                    id: `USR-${String(lastNum).padStart(3, "0")}`,
                  }
                : null

            vi.mocked(prisma.user.findFirst).mockResolvedValue(mockLastUser as any)

            const newId = await userService.generateId()

            expect(newId).toMatch(/^USR-\d{3}$/)

            const expectedNum = lastNum + 1
            expect(newId).toBe(`USR-${String(expectedNum).padStart(3, "0")}`)
          },
        ),
        { numRuns: 50 },
      )
    })
  })
})

describe("Feature: form-crud-implementation, Property 6: Default values are set correctly", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("assetService.create - default values", () => {
    it("should set status to 'aktif' and condition to 'baik' for any new asset", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
            category: fc.constantFrom("Elektronik", "Furnitur"),
            location: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{1,30}$/),
            purchaseDate: fc.constant("2024-01-15"),
            purchasePrice: fc.nat({ max: 10000000 }),
            description: fc.string({ maxLength: 100 }),
          }),
          async (input) => {
            vi.clearAllMocks()

            vi.mocked(prisma.asset.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.asset.create))

            const result = await assetService.create(input)

            // Verify default values
            expect(result.status).toBe("aktif")
            expect(result.condition).toBe("baik")

            // Verify create was called with default values
            expect(prisma.asset.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                status: "aktif",
                condition: "baik",
              }),
            })
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("mutationService.create - default values", () => {
    it("should set status to 'diproses' for any new mutation", async () => {
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
            const assetName = "Test Asset"

            vi.mocked(prisma.mutation.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.mutation.create))

            const result = await mutationService.create(input, assetName)

            // Verify default status
            expect(result.status).toBe("diproses")

            // Verify create was called with default status
            expect(prisma.mutation.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                status: "diproses",
              }),
            })
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("userService.create - default values", () => {
    it("should set status to 'aktif' for any new user", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,30}$/),
            email: fc
              .tuple(
                fc.stringMatching(/^[a-z][a-z0-9]{2,8}$/),
                fc.stringMatching(/^[a-z]{2,8}$/),
                fc.constantFrom("com", "org", "id"),
              )
              .map(([local, domain, tld]) => `${local}@${domain}.${tld}`),
            password: fc.stringMatching(/^[a-zA-Z0-9]{6,15}$/),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          async (input) => {
            vi.clearAllMocks()

            vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
            mockCreate(vi.mocked(prisma.user.create))

            const result = await userService.create(input)

            // Verify default status
            expect(result.status).toBe("aktif")

            // Verify create was called with default status
            expect(prisma.user.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                status: "aktif",
              }),
            })
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should generate avatar URL based on user name", async () => {
      await fc.assert(
        fc.asyncProperty(fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,30}$/), async (name) => {
          vi.clearAllMocks()

          const input = {
            name,
            email: "test@example.com",
            password: "password123",
            role: "staff" as const,
          }

          vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
          mockCreate(vi.mocked(prisma.user.create))

          const result = await userService.create(input)

          // Verify avatar is generated from name
          expect(result.avatar).toContain("dicebear")
          expect(result.avatar).toContain(encodeURIComponent(name))
        }),
        { numRuns: 30 },
      )
    })
  })

  describe("auditService.create - default values", () => {
    it("should auto-generate timestamp for any new audit log", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            user: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,30}$/),
            action: fc.constantFrom("CREATE", "UPDATE", "DELETE"),
            module: fc.constantFrom("Aset", "Lokasi", "Mutasi", "Users"),
            details: fc.stringMatching(/^[a-zA-Z0-9\s]{1,50}$/),
          }),
          async (input) => {
            vi.clearAllMocks()

            vi.mocked(prisma.auditLog.create).mockImplementation(
              (args: { data: Record<string, unknown> }) =>
                Promise.resolve({ id: "LOG-001", ...args.data }) as any,
            )

            const result = await auditService.create(input)

            // Verify timestamp is set
            expect(result.timestamp).toBeDefined()
            expect(typeof result.timestamp).toBe("string")

            // Verify create was called with timestamp
            expect(prisma.auditLog.create).toHaveBeenCalledWith({
              data: expect.objectContaining({
                timestamp: expect.any(String),
              }),
            })
          },
        ),
        { numRuns: 30 },
      )
    })
  })
})
