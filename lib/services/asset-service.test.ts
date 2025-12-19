import { describe, it, expect, vi, beforeEach } from "vitest"
import { assetService } from "./asset-service"
import { prisma } from "@/lib/db"

vi.mock("@/lib/db", () => ({
    prisma: {
        asset: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}))

const mockAssets = [
    {
        id: "AST-001",
        name: "Laptop Dell",
        category: "Elektronik",
        status: "aktif",
        location: "Ruang IT",
        purchaseDate: "2024-01-01",
        purchasePrice: 15000000,
        condition: "baik",
        description: "Laptop kerja",
    },
]

describe("assetService", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return all assets with valid schema", async () => {
        vi.mocked(prisma.asset.findMany).mockResolvedValue(mockAssets as any)

        const allAssets = await assetService.getAll()
        expect(allAssets).toHaveLength(mockAssets.length)
        expect(allAssets[0].id).toBe("AST-001")
        expect(prisma.asset.findMany).toHaveBeenCalled()
    })

    it("should return an asset by id", async () => {
        vi.mocked(prisma.asset.findUnique).mockResolvedValue(mockAssets[0] as any)

        const asset = await assetService.getById("AST-001")
        expect(asset).toBeDefined()
        expect(asset?.id).toBe("AST-001")
    })

    it("should return null for non-existent asset id", async () => {
        vi.mocked(prisma.asset.findUnique).mockResolvedValue(null)

        const asset = await assetService.getById("NON-EXISTENT")
        expect(asset).toBeNull()
    })
})
