import { describe, it, expect } from "vitest"
import fc from "fast-check"
import { createAssetSchema } from "../asset"
import { createLocationSchema } from "../location"
import { createMutationSchema } from "../mutation"
import { createUserSchema } from "../user"
import { createAuditLogSchema } from "../audit"

/**
 * Property Tests for Validation Schemas
 * Feature: form-crud-implementation
 *
 * These tests verify:
 * - Property 4: Validation rejects invalid input
 * - Property 5: Mutation location validation
 */

describe("Feature: form-crud-implementation, Property 4: Validation rejects invalid input", () => {
  describe("createAssetSchema", () => {
    // Helper to generate valid date strings (YYYY-MM-DD format)
    const validDateArb = fc.integer({ min: 2020, max: 2030 }).chain((year) =>
      fc.integer({ min: 1, max: 12 }).chain((month) =>
        fc
          .integer({ min: 1, max: 28 }) // Use 28 to avoid invalid dates
          .map(
            (day) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          ),
      ),
    )

    it("should accept valid asset input", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            category: fc.string({ minLength: 1, maxLength: 50 }),
            location: fc.string({ minLength: 1, maxLength: 100 }),
            purchaseDate: validDateArb,
            purchasePrice: fc.nat({ max: 1000000000 }),
            description: fc.string({ maxLength: 500 }),
          }),
          (input) => {
            const result = createAssetSchema.safeParse(input)
            expect(result.success).toBe(true)
          },
        ),
        { numRuns: 100 },
      )
    })

    it("should reject empty name", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.constant(""),
            category: fc.string({ minLength: 1 }),
            location: fc.string({ minLength: 1 }),
            purchaseDate: fc.constant("2024-01-01"),
            purchasePrice: fc.nat(),
            description: fc.string(),
          }),
          (input) => {
            const result = createAssetSchema.safeParse(input)
            expect(result.success).toBe(false)
            if (!result.success) {
              expect(result.error.issues.some((i) => i.path.includes("name"))).toBe(true)
            }
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject empty category", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            category: fc.constant(""),
            location: fc.string({ minLength: 1 }),
            purchaseDate: fc.constant("2024-01-01"),
            purchasePrice: fc.nat(),
            description: fc.string(),
          }),
          (input) => {
            const result = createAssetSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject negative purchase price", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            category: fc.string({ minLength: 1 }),
            location: fc.string({ minLength: 1 }),
            purchaseDate: fc.constant("2024-01-01"),
            purchasePrice: fc.integer({ min: -1000000, max: -1 }),
            description: fc.string(),
          }),
          (input) => {
            const result = createAssetSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("createLocationSchema", () => {
    it("should accept valid location input", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 100 }),
            type: fc.constantFrom("gedung", "lantai", "ruangan"),
            parentId: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
          }),
          (input) => {
            const result = createLocationSchema.safeParse(input)
            expect(result.success).toBe(true)
          },
        ),
        { numRuns: 100 },
      )
    })

    it("should reject empty name", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.constant(""),
            type: fc.constantFrom("gedung", "lantai", "ruangan"),
          }),
          (input) => {
            const result = createLocationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject invalid location type", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            type: fc.string().filter((s) => !["gedung", "lantai", "ruangan"].includes(s)),
          }),
          (input) => {
            const result = createLocationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("createUserSchema", () => {
    // Helper to generate valid email addresses
    const validEmailArb = fc
      .tuple(
        fc.stringMatching(/^[a-z][a-z0-9]{2,10}$/),
        fc.stringMatching(/^[a-z]{2,10}$/),
        fc.constantFrom("com", "org", "edu", "id", "co.id"),
      )
      .map(([local, domain, tld]) => `${local}@${domain}.${tld}`)

    it("should accept valid user input", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.stringMatching(/^[a-zA-Z][a-zA-Z\s]{1,50}$/),
            email: validEmailArb,
            password: fc.stringMatching(/^[a-zA-Z0-9!@#$%]{6,20}$/),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          (input) => {
            const result = createUserSchema.safeParse(input)
            expect(result.success).toBe(true)
          },
        ),
        { numRuns: 100 },
      )
    })

    it("should reject invalid email format", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            email: fc.string().filter((s) => !s.includes("@") || !s.includes(".")),
            password: fc.string({ minLength: 6 }),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          (input) => {
            const result = createUserSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject password shorter than 6 characters", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            password: fc.string({ minLength: 1, maxLength: 5 }),
            role: fc.constantFrom("admin", "manager", "staff", "viewer"),
          }),
          (input) => {
            const result = createUserSchema.safeParse(input)
            expect(result.success).toBe(false)
            if (!result.success) {
              expect(result.error.issues.some((i) => i.path.includes("password"))).toBe(true)
            }
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject invalid role", () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1 }),
            email: fc.emailAddress(),
            password: fc.string({ minLength: 6 }),
            role: fc.string().filter((s) => !["admin", "manager", "staff", "viewer"].includes(s)),
          }),
          (input) => {
            const result = createUserSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })
  })

  describe("createAuditLogSchema", () => {
    it("should accept valid audit log input", () => {
      fc.assert(
        fc.property(
          fc.record({
            user: fc.string({ minLength: 1, maxLength: 100 }),
            action: fc.constantFrom("CREATE", "UPDATE", "DELETE"),
            module: fc.string({ minLength: 1, maxLength: 50 }),
            details: fc.string({ minLength: 1, maxLength: 500 }),
          }),
          (input) => {
            const result = createAuditLogSchema.safeParse(input)
            expect(result.success).toBe(true)
          },
        ),
        { numRuns: 100 },
      )
    })

    it("should reject invalid action type", () => {
      fc.assert(
        fc.property(
          fc.record({
            user: fc.string({ minLength: 1 }),
            action: fc.string().filter((s) => !["CREATE", "UPDATE", "DELETE"].includes(s)),
            module: fc.string({ minLength: 1 }),
            details: fc.string({ minLength: 1 }),
          }),
          (input) => {
            const result = createAuditLogSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })
  })
})

describe("Feature: form-crud-implementation, Property 5: Mutation location validation", () => {
  describe("createMutationSchema", () => {
    // Helper to generate valid date string
    const validDateArb = fc
      .integer({ min: 2020, max: 2030 })
      .chain((year) =>
        fc
          .integer({ min: 1, max: 12 })
          .chain((month) =>
            fc
              .integer({ min: 1, max: 28 })
              .map(
                (day) =>
                  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
              ),
          ),
      )

    it("should accept valid mutation input with different locations", () => {
      fc.assert(
        fc.property(
          fc
            .tuple(
              fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
              fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
            )
            .filter(([from, to]) => from !== to),
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          validDateArb,
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          fc.string({ maxLength: 200 }),
          ([fromLocation, toLocation], assetId, date, requester, notes) => {
            const input = { assetId, fromLocation, toLocation, date, requester, notes }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(true)
          },
        ),
        { numRuns: 100 },
      )
    })

    it("should reject mutation when fromLocation equals toLocation", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          fc.constant("2024-01-15"),
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          fc.string({ maxLength: 200 }),
          (sameLocation, assetId, date, requester, notes) => {
            const input = {
              assetId,
              fromLocation: sameLocation,
              toLocation: sameLocation, // Same as fromLocation
              date,
              requester,
              notes,
            }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(false)
            if (!result.success) {
              // Should have error on toLocation path
              expect(result.error.issues.some((i) => i.path.includes("toLocation"))).toBe(true)
              expect(
                result.error.issues.some(
                  (i) =>
                    i.message.toLowerCase().includes("sama") ||
                    i.message.toLowerCase().includes("same"),
                ),
              ).toBe(true)
            }
          },
        ),
        { numRuns: 100 },
      )
    })

    it("should reject empty assetId", () => {
      fc.assert(
        fc.property(
          fc
            .tuple(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }))
            .filter(([from, to]) => from !== to),
          fc.constant("2024-01-01"),
          fc.string({ minLength: 1 }),
          ([fromLocation, toLocation], date, requester) => {
            const input = {
              assetId: "",
              fromLocation,
              toLocation,
              date,
              requester,
              notes: "",
            }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject empty fromLocation", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          fc.constant("2024-01-01"),
          fc.string({ minLength: 1 }),
          (assetId, toLocation, date, requester) => {
            const input = {
              assetId,
              fromLocation: "",
              toLocation,
              date,
              requester,
              notes: "",
            }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject empty toLocation", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          fc.constant("2024-01-01"),
          fc.string({ minLength: 1 }),
          (assetId, fromLocation, date, requester) => {
            const input = {
              assetId,
              fromLocation,
              toLocation: "",
              date,
              requester,
              notes: "",
            }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject empty date", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc
            .tuple(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }))
            .filter(([from, to]) => from !== to),
          fc.string({ minLength: 1 }),
          (assetId, [fromLocation, toLocation], requester) => {
            const input = {
              assetId,
              fromLocation,
              toLocation,
              date: "",
              requester,
              notes: "",
            }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })

    it("should reject empty requester", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc
            .tuple(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }))
            .filter(([from, to]) => from !== to),
          fc.constant("2024-01-01"),
          (assetId, [fromLocation, toLocation], date) => {
            const input = {
              assetId,
              fromLocation,
              toLocation,
              date,
              requester: "",
              notes: "",
            }
            const result = createMutationSchema.safeParse(input)
            expect(result.success).toBe(false)
          },
        ),
        { numRuns: 50 },
      )
    })
  })
})
