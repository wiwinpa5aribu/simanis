/**
 * Integration Tests for Form CRUD Implementation
 * Feature: form-crud-implementation, Task 7.1
 *
 * Tests complete flow: form submit → server action → service → result
 * Validates: Requirements 1.1, 2.1, 3.1, 4.1
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { createAsset } from "../asset-actions"
import { createLocation } from "../location-actions"
import { createMutation } from "../mutation-actions"
import { createUser } from "../user-actions"

// Mock service layer directly for cleaner integration tests
vi.mock("@/lib/services/asset-service", () => ({
  assetService: {
    create: vi.fn(),
    generateId: vi.fn(),
    getById: vi.fn(),
  },
}))

vi.mock("@/lib/services/location-service", () => ({
  locationService: {
    create: vi.fn(),
    generateId: vi.fn(),
  },
}))

vi.mock("@/lib/services/mutation-service", () => ({
  mutationService: {
    create: vi.fn(),
    generateId: vi.fn(),
  },
}))

vi.mock("@/lib/services/user-service", () => ({
  userService: {
    create: vi.fn(),
    generateId: vi.fn(),
    checkEmailExists: vi.fn(),
  },
}))

vi.mock("@/lib/services/audit-service", () => ({
  auditService: {
    create: vi.fn(),
  },
}))

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

// Import mocked services
import { assetService } from "@/lib/services/asset-service"
import { locationService } from "@/lib/services/location-service"
import { mutationService } from "@/lib/services/mutation-service"
import { userService } from "@/lib/services/user-service"
import { auditService } from "@/lib/services/audit-service"

describe("Feature: form-crud-implementation, Task 7: Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Requirement 1.1: Asset Creation Flow", () => {
    it("should complete full asset creation flow with valid data", async () => {
      const assetInput = {
        name: "Laptop Dell Latitude",
        category: "Elektronik",
        location: "Ruang Guru",
        purchaseDate: "2024-06-15",
        purchasePrice: 15000000,
        description: "Laptop untuk keperluan administrasi",
      }

      const createdAsset = { id: "AST-0001", ...assetInput, status: "aktif", condition: "baik" }

      vi.mocked(assetService.create).mockResolvedValue(createdAsset as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createAsset(assetInput)

      expect(result.success).toBe(true)
      expect(result.data).toBe("AST-0001")
      expect(assetService.create).toHaveBeenCalledWith(assetInput)
      expect(auditService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: "CREATE", module: "Aset" }),
      )
    })

    it("should reject asset creation with empty required fields", async () => {
      const invalidInput = {
        name: "",
        category: "Elektronik",
        location: "Ruang Guru",
        purchaseDate: "2024-06-15",
        purchasePrice: 15000000,
        description: "",
      }

      const result = await createAsset(invalidInput)

      expect(result.success).toBe(false)
      expect(assetService.create).not.toHaveBeenCalled()
      expect(auditService.create).not.toHaveBeenCalled()
    })

    it("should reject asset creation with negative price", async () => {
      const invalidInput = {
        name: "Test Asset",
        category: "Elektronik",
        location: "Ruang Guru",
        purchaseDate: "2024-06-15",
        purchasePrice: -1000,
        description: "",
      }

      const result = await createAsset(invalidInput)

      expect(result.success).toBe(false)
      expect(assetService.create).not.toHaveBeenCalled()
    })
  })

  describe("Requirement 2.1: Location Creation Flow", () => {
    it("should complete full location creation flow with valid data", async () => {
      const locationInput = { name: "Gedung Utama", type: "gedung" as const, parentId: undefined }
      const createdLocation = {
        id: "LOC-001",
        name: locationInput.name,
        type: locationInput.type,
        parentId: null,
        assetCount: 0,
      }

      vi.mocked(locationService.create).mockResolvedValue(createdLocation as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createLocation(locationInput)

      expect(result.success).toBe(true)
      expect(result.data).toBe("LOC-001")
      expect(locationService.create).toHaveBeenCalledWith(locationInput)
      expect(auditService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: "CREATE", module: "Lokasi" }),
      )
    })

    it("should create location with parent reference", async () => {
      const locationInput = { name: "Lantai 1", type: "lantai" as const, parentId: "LOC-001" }
      const createdLocation = { id: "LOC-002", ...locationInput, assetCount: 0 }

      vi.mocked(locationService.create).mockResolvedValue(createdLocation as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createLocation(locationInput)

      expect(result.success).toBe(true)
      expect(locationService.create).toHaveBeenCalledWith(
        expect.objectContaining({ parentId: "LOC-001" }),
      )
    })

    it("should reject location creation with empty name", async () => {
      const invalidInput = { name: "", type: "gedung" as const }

      const result = await createLocation(invalidInput)

      expect(result.success).toBe(false)
      expect(locationService.create).not.toHaveBeenCalled()
    })
  })

  describe("Requirement 3.1: Mutation Creation Flow", () => {
    it("should complete full mutation creation flow with valid data", async () => {
      const mutationInput = {
        assetId: "AST-0001",
        fromLocation: "Ruang Guru",
        toLocation: "Ruang Kelas 1A",
        date: "2024-06-20",
        requester: "Budi Santoso",
        notes: "Pemindahan untuk kebutuhan pembelajaran",
      }
      const mockAsset = { id: "AST-0001", name: "Laptop Dell" }
      const createdMutation = {
        id: "MUT-001",
        ...mutationInput,
        assetName: mockAsset.name,
        status: "diproses",
      }

      vi.mocked(assetService.getById).mockResolvedValue(mockAsset as any)
      vi.mocked(mutationService.create).mockResolvedValue(createdMutation as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createMutation(mutationInput)

      expect(result.success).toBe(true)
      expect(result.data).toBe("MUT-001")
      expect(mutationService.create).toHaveBeenCalledWith(mutationInput, mockAsset.name)
    })

    it("should reject mutation when source equals destination (Requirement 3.6)", async () => {
      const invalidInput = {
        assetId: "AST-0001",
        fromLocation: "Ruang Guru",
        toLocation: "Ruang Guru",
        date: "2024-06-20",
        requester: "Budi Santoso",
        notes: "",
      }

      const result = await createMutation(invalidInput)

      expect(result.success).toBe(false)
      expect(result.error).toContain("tidak boleh sama")
      expect(mutationService.create).not.toHaveBeenCalled()
    })

    it("should reject mutation when asset not found", async () => {
      const input = {
        assetId: "AST-9999",
        fromLocation: "Ruang A",
        toLocation: "Ruang B",
        date: "2024-06-20",
        requester: "Test User",
        notes: "",
      }

      vi.mocked(assetService.getById).mockResolvedValue(null)

      const result = await createMutation(input)

      expect(result.success).toBe(false)
      expect(result.error).toContain("tidak ditemukan")
      expect(mutationService.create).not.toHaveBeenCalled()
    })
  })

  describe("Requirement 4.1: User Creation Flow", () => {
    it("should complete full user creation flow with valid data", async () => {
      const userInput = {
        name: "Ahmad Wijaya",
        email: "ahmad.wijaya@sekolah.id",
        password: "securePassword123",
        role: "staff" as const,
      }
      const createdUser = {
        id: "USR-001",
        name: userInput.name,
        email: userInput.email,
        role: userInput.role,
        status: "aktif",
      }

      vi.mocked(userService.checkEmailExists).mockResolvedValue(false)
      vi.mocked(userService.create).mockResolvedValue(createdUser as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createUser(userInput)

      expect(result.success).toBe(true)
      expect(result.data).toBe("USR-001")
      expect(userService.create).toHaveBeenCalledWith(userInput)
    })

    it("should reject user creation with duplicate email (Requirement 4.6)", async () => {
      const userInput = {
        name: "Test User",
        email: "existing@sekolah.id",
        password: "password123",
        role: "staff" as const,
      }

      vi.mocked(userService.checkEmailExists).mockResolvedValue(true)

      const result = await createUser(userInput)

      expect(result.success).toBe(false)
      expect(result.error).toContain("sudah terdaftar")
      expect(userService.create).not.toHaveBeenCalled()
    })

    it("should reject user creation with invalid email format", async () => {
      const invalidInput = {
        name: "Test User",
        email: "invalid-email-format",
        password: "password123",
        role: "staff" as const,
      }

      const result = await createUser(invalidInput)

      expect(result.success).toBe(false)
      expect(userService.create).not.toHaveBeenCalled()
    })

    it("should reject user creation with short password", async () => {
      const invalidInput = {
        name: "Test User",
        email: "test@sekolah.id",
        password: "123",
        role: "staff" as const,
      }

      const result = await createUser(invalidInput)

      expect(result.success).toBe(false)
      expect(userService.create).not.toHaveBeenCalled()
    })
  })

  describe("Cross-cutting: Audit Log Integration", () => {
    it("should create audit logs for all successful CRUD operations", async () => {
      vi.mocked(assetService.create).mockResolvedValue({ id: "AST-0001", name: "Test" } as any)
      vi.mocked(locationService.create).mockResolvedValue({ id: "LOC-001", name: "Test" } as any)
      vi.mocked(userService.checkEmailExists).mockResolvedValue(false)
      vi.mocked(userService.create).mockResolvedValue({ id: "USR-001", name: "Test" } as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      await createAsset({
        name: "Test Asset",
        category: "Elektronik",
        location: "Ruang A",
        purchaseDate: "2024-01-15",
        purchasePrice: 1000000,
        description: "",
      })
      await createLocation({ name: "Test Location", type: "gedung" })
      await createUser({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "staff",
      })

      expect(auditService.create).toHaveBeenCalledTimes(3)
    })

    it("should NOT create audit logs for failed operations", async () => {
      vi.mocked(auditService.create).mockClear()

      await createAsset({
        name: "",
        category: "",
        location: "",
        purchaseDate: "",
        purchasePrice: 0,
        description: "",
      })
      await createLocation({ name: "", type: "gedung" })
      await createUser({ name: "", email: "invalid", password: "123", role: "staff" })

      expect(auditService.create).not.toHaveBeenCalled()
    })
  })

  describe("ID Generation Pattern Verification", () => {
    it("should return generated ID from service for assets (AST-XXXX)", async () => {
      vi.mocked(assetService.create).mockResolvedValue({ id: "AST-0006", name: "New Asset" } as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createAsset({
        name: "New Asset",
        category: "Elektronik",
        location: "Ruang A",
        purchaseDate: "2024-01-15",
        purchasePrice: 1000000,
        description: "",
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe("AST-0006")
    })

    it("should return generated ID from service for locations (LOC-XXX)", async () => {
      vi.mocked(locationService.create).mockResolvedValue({
        id: "LOC-011",
        name: "New Location",
      } as any)
      vi.mocked(auditService.create).mockResolvedValue({} as any)

      const result = await createLocation({ name: "New Location", type: "ruangan" })

      expect(result.success).toBe(true)
      expect(result.data).toBe("LOC-011")
    })
  })
})
