import { describe, it, expect, vi } from "vitest"
import { assetService } from "./asset-service"
import { assets } from "@/lib/data"

describe("assetService", () => {
    it("should return all assets with valid schema", () => {
        const allAssets = assetService.getAll()
        expect(allAssets).toHaveLength(assets.length)
        expect(allAssets[0]).toHaveProperty("id")
        expect(allAssets[0]).toHaveProperty("name")
    })

    it("should return an asset by id", () => {
        const asset = assetService.getById("AST-001")
        expect(asset).toBeDefined()
        expect(asset?.id).toBe("AST-001")
    })

    it("should return undefined for non-existent asset id", () => {
        const asset = assetService.getById("NON-EXISTENT")
        expect(asset).toBeUndefined()
    })
})
