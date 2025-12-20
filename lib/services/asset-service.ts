import { prisma } from "@/lib/db"
import { assetSchema, createAssetSchema, type TAsset, type CreateAssetInput } from "@/lib/validations/asset"

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

    /**
     * Creates a new asset in the database.
     * @param {CreateAssetInput} data - The asset data to create.
     * @returns {Promise<TAsset>} The created and validated asset object.
     */
    create: async (data: CreateAssetInput): Promise<TAsset> => {
        const validated = createAssetSchema.parse(data)
        const id = await assetService.generateId()
        
        const asset = await prisma.asset.create({
            data: {
                id,
                name: validated.name,
                category: validated.category,
                status: "aktif",
                location: validated.location,
                purchaseDate: validated.purchaseDate,
                purchasePrice: validated.purchasePrice,
                condition: "baik",
                description: validated.description,
            }
        })
        
        return assetSchema.parse(asset)
    },

    /**
     * Generates a unique asset ID following AST-XXXX pattern.
     * @returns {Promise<string>} The generated unique ID.
     */
    generateId: async (): Promise<string> => {
        const lastAsset = await prisma.asset.findFirst({
            orderBy: { id: "desc" },
            where: { id: { startsWith: "AST-" } }
        })
        const lastNum = lastAsset ? parseInt(lastAsset.id.split("-")[1]) : 0
        return `AST-${String(lastNum + 1).padStart(4, "0")}`
    },
}


