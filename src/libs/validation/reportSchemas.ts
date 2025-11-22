/**
 * Skema validasi untuk laporan
 */

import { z } from "zod";

// Skema untuk filter laporan KIB
export const kibReportFiltersSchema = z.object({
  category_id: z.number().optional(),
  room_id: z.number().optional(),
  condition: z
    .enum(["Baik", "Rusak Ringan", "Rusak Berat", "Hilang"])
    .optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export type KIBReportFiltersForm = z.infer<typeof kibReportFiltersSchema>;
