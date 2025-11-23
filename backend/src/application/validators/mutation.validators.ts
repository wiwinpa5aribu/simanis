import { z } from 'zod';

/**
 * Create mutation schema
 */
export const createMutationSchema = z.object({
    assetId: z.number().int().positive(),
    toRoomId: z.number().int().positive(),
    note: z.string().optional(),
});

export type CreateMutationInput = z.infer<typeof createMutationSchema>;
