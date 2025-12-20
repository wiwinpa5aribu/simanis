import { prisma } from "@/lib/db"
import { locationSchema, createLocationSchema, type TLocation, type CreateLocationInput } from "@/lib/validations/location"

/**
 * Service for managing Location data and hierarchies.
 */
export const locationService = {
    /**
     * Retrieves all locations and validates them against the schema.
     * @returns {Promise<TLocation[]>} An array of validated location objects.
     */
    getAll: async (): Promise<TLocation[]> => {
        const locations = await prisma.location.findMany()
        return locations.map((loc) => {
            const result = locationSchema.safeParse(loc)
            if (!result.success) {
                console.error("Validation error for location:", loc.id, result.error.format())
                throw new Error(`Data lokasi tidak valid: ${loc.id}`)
            }
            return result.data
        })
    },

    /**
     * Creates a new location in the database.
     * @param {CreateLocationInput} data - The location data to create.
     * @returns {Promise<TLocation>} The created and validated location object.
     */
    create: async (data: CreateLocationInput): Promise<TLocation> => {
        const validated = createLocationSchema.parse(data)
        const id = await locationService.generateId()
        
        const location = await prisma.location.create({
            data: {
                id,
                name: validated.name,
                type: validated.type,
                parentId: validated.parentId || null,
                assetCount: 0,
            }
        })
        
        return locationSchema.parse(location)
    },

    /**
     * Generates a unique location ID following LOC-XXX pattern.
     * @returns {Promise<string>} The generated unique ID.
     */
    generateId: async (): Promise<string> => {
        const lastLocation = await prisma.location.findFirst({
            orderBy: { id: "desc" },
            where: { id: { startsWith: "LOC-" } }
        })
        const lastNum = lastLocation ? parseInt(lastLocation.id.split("-")[1]) : 0
        return `LOC-${String(lastNum + 1).padStart(3, "0")}`
    },
}


