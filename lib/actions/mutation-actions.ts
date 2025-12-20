"use server"

import { revalidatePath } from "next/cache"
import { mutationService } from "@/lib/services/mutation-service"
import { assetService } from "@/lib/services/asset-service"
import { auditService } from "@/lib/services/audit-service"
import { createMutationSchema, type CreateMutationInput } from "@/lib/validations/mutation"
import { z } from "zod"
import type { ActionResult } from "./types"

export async function createMutation(data: CreateMutationInput): Promise<ActionResult<string>> {
  try {
    // Validate input
    const validated = createMutationSchema.parse(data)

    // Get asset name
    const asset = await assetService.getById(validated.assetId)
    if (!asset) {
      return { success: false, error: "Aset tidak ditemukan" }
    }

    // Create mutation
    const mutation = await mutationService.create(validated, asset.name)

    // Create audit log
    await auditService.create({
      user: "System", // TODO: Get from session
      action: "CREATE",
      module: "Mutasi",
      details: `Menambahkan mutasi baru: ${asset.name} dari ${validated.fromLocation} ke ${validated.toLocation} (${mutation.id})`,
    })

    // Revalidate paths
    revalidatePath("/mutasi")
    revalidatePath("/audit")

    return { success: true, data: mutation.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    console.error("Create mutation error:", error)
    return { success: false, error: "Gagal menyimpan data mutasi" }
  }
}
