import { z } from 'zod';

/**
 * Create category schema
 */
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Nama kategori wajib diisi').max(64, 'Nama kategori maksimal 64 karakter'),
    description: z.string().optional(),
});

/**
 * Update category schema
 */
export const updateCategorySchema = z.object({
    name: z.string().min(1).max(64).optional(),
    description: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
