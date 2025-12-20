"use server"

import { revalidatePath } from "next/cache"
import { assetService } from "@/lib/services/asset-service"
import { auditService } from "@/lib/services/audit-service"
import { createAssetSchema, type CreateAssetInput } from "@/lib/validations/asset"
import { z } from "zod"
import type { ActionResult } from "./types"

export async function createAsset(data: CreateAssetInput): Promise<ActionResult<string>> {
  try {
    // Validate input
    const validated = createAssetSchema.parse(data)

    // Create asset
    const asset = await assetService.create(validated)

    // Create audit log
    await auditService.create({
      user: "System", // TODO: Get from session
      action: "CREATE",
      module: "Aset",
      details: `Menambahkan aset baru: ${asset.name} (${asset.id})`,
    })

    // Revalidate paths
    revalidatePath("/aset")
    revalidatePath("/audit")

    return { success: true, data: asset.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    console.error("Create asset error:", error)
    return { success: false, error: "Gagal menyimpan data aset" }
  }
}
