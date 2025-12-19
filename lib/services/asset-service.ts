import { assets } from "@/lib/data"
import { assetSchema, type TAsset } from "@/lib/validations/asset"

/**
 * Service for managing Asset data.
 * Handles fetching, filtering, and Zod validation for Asset entities.
 */
export const assetService = {
    /**
     * Retrieves all assets from the data source and validates them.
     * @returns {TAsset[]} An array of validated asset objects.
     * @throws {Error} If data validation fails for any asset.
     */
    getAll: (): TAsset[] => {
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
     * @param {string} id - The unique ID of the asset (e.g., 'AST-001').
     * @returns {TAsset | undefined} The validated asset object, or undefined if not found.
     * @throws {Error} If the found asset fails validation.
     */
    getById: (id: string): TAsset | undefined => {
        const asset = assets.find((a) => a.id === id)
        if (!asset) return undefined

        const result = assetSchema.safeParse(asset)
        if (!result.success) {
            throw new Error(`Data aset tidak valid: ${id}`)
        }
        return result.data
    },
}

