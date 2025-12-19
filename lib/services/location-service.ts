import { locations } from "@/lib/data"
import { locationSchema, type TLocation } from "@/lib/validations/location"

/**
 * Service for managing Location data and hierarchies.
 */
export const locationService = {
    /**
     * Retrieves all locations and validates them against the schema.
     * @returns {TLocation[]} An array of validated location objects.
     */
    getAll: (): TLocation[] => {
        return locations.map((loc) => {


            const result = locationSchema.safeParse(loc)
            if (!result.success) {
                console.error("Validation error for location:", loc.id, result.error.format())
                throw new Error(`Data lokasi tidak valid: ${loc.id}`)
            }
            return result.data
        })
    },
}

