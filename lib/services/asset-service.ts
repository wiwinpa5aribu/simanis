import { prisma } from "@/lib/db"
import { assetSchema, type TAsset } from "@/lib/validations/asset"

/**
 * Service for managing Asset data.
 * Handles fetching from database and Zod validation.
 */
export const assetService = {
    /**
     * Retrieves all assets from the database and validates them.
     * @returns {Promise<TAsset[]>} An array of validated asset objects.
     */
    getAll: async (): Promise<TAsset[]> => {
        const assets = await prisma.asset.findMany()
        return assets.map((asset) => {
            const result = assetSchema.safeParse(asset)
            if (!result.success) {
                console.error("Validation error for asset:", asset.id, result.error.format())
                throw new Error(`Data aset tidak valid: ${asset.id}`)
            }
            return result.data
        })
    },

    /**
     * Finds a specific asset by its unique identifier.
     * @param {string} id - The unique ID of the asset.
     * @returns {Promise<TAsset | null>} The validated asset object, or null if not found.
     */
    getById: async (id: string): Promise<TAsset | null> => {
        const asset = await prisma.asset.findUnique({
            where: { id },
        })
        if (!asset) return null

        const result = assetSchema.safeParse(asset)
        if (!result.success) {
            throw new Error(`Data aset tidak valid: ${id}`)
        }
        return result.data
    },
}


