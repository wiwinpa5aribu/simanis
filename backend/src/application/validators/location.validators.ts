import { z } from 'zod';

/**
 * Building Validators
 */
export const createBuildingSchema = z.object({
  name: z.string().min(1, 'Nama gedung wajib diisi').max(80, 'Nama gedung maksimal 80 karakter'),
});

export const updateBuildingSchema = z.object({
  name: z.string().min(1, 'Nama gedung wajib diisi').max(80, 'Nama gedung maksimal 80 karakter'),
});

/**
 * Floor Validators
 */
export const createFloorSchema = z.object({
  levelNumber: z
    .number()
    .int('Nomor lantai harus bilangan bulat')
    .min(0, 'Nomor lantai tidak boleh negatif'),
});

export const updateFloorSchema = z.object({
  levelNumber: z
    .number()
    .int('Nomor lantai harus bilangan bulat')
    .min(0, 'Nomor lantai tidak boleh negatif'),
});

/**
 * Room Validators
 */
export const createRoomSchema = z.object({
  name: z.string().min(1, 'Nama ruangan wajib diisi').max(80, 'Nama ruangan maksimal 80 karakter'),
  code: z.string().max(32, 'Kode ruangan maksimal 32 karakter').optional().nullable(),
});

export const updateRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama ruangan wajib diisi')
    .max(80, 'Nama ruangan maksimal 80 karakter')
    .optional(),
  code: z.string().max(32, 'Kode ruangan maksimal 32 karakter').optional().nullable(),
});

// Type exports
export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export type UpdateBuildingInput = z.infer<typeof updateBuildingSchema>;
export type CreateFloorInput = z.infer<typeof createFloorSchema>;
export type UpdateFloorInput = z.infer<typeof updateFloorSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
