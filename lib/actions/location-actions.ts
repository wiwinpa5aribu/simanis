"use server"

import { revalidatePath } from "next/cache"
import { locationService } from "@/lib/services/location-service"
import { auditService } from "@/lib/services/audit-service"
import { createLocationSchema, type CreateLocationInput } from "@/lib/validations/location"
import { z } from "zod"
import type { ActionResult } from "./types"

export async function createLocation(data: CreateLocationInput): Promise<ActionResult<string>> {
  try {
    // Validate input
    const validated = createLocationSchema.parse(data)

    // Create location
    const location = await locationService.create(validated)

    // Create audit log
    await auditService.create({
      user: "System", // TODO: Get from session
      action: "CREATE",
      module: "Lokasi",
      details: `Menambahkan lokasi baru: ${location.name} (${location.id})`,
    })

    // Revalidate paths
    revalidatePath("/lokasi")
    revalidatePath("/audit")

    return { success: true, data: location.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    console.error("Create location error:", error)
    return { success: false, error: "Gagal menyimpan data lokasi" }
  }
}
