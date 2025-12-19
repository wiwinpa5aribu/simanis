import { locations } from "@/lib/data"
import { locationSchema, type TLocation } from "@/lib/validations/location"

export const locationService = {
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
