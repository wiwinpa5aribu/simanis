import { z } from 'zod';

/**
 * User query params validator
 */
export const userQuerySchema = z.object({
    search: z.string().optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    pageSize: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 20)),
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;
