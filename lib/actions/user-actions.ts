"use server"

import { revalidatePath } from "next/cache"
import { userService } from "@/lib/services/user-service"
import { auditService } from "@/lib/services/audit-service"
import { createUserSchema, type CreateUserInput } from "@/lib/validations/user"
import { z } from "zod"
import type { ActionResult } from "./types"

export async function createUser(data: CreateUserInput): Promise<ActionResult<string>> {
  try {
    // Validate input
    const validated = createUserSchema.parse(data)

    // Check email uniqueness
    const emailExists = await userService.checkEmailExists(validated.email)
    if (emailExists) {
      return { success: false, error: "Email sudah terdaftar" }
    }

    // Create user
    const user = await userService.create(validated)

    // Create audit log
    await auditService.create({
      user: "System", // TODO: Get from session
      action: "CREATE",
      module: "Users",
      details: `Menambahkan user baru: ${user.name} (${user.id})`,
    })

    // Revalidate paths
    revalidatePath("/users")
    revalidatePath("/audit")

    return { success: true, data: user.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    console.error("Create user error:", error)
    return { success: false, error: "Gagal menyimpan data user" }
  }
}
