import { z } from 'zod';

export const DashboardSummaryQuerySchema = z.object({
  country: z.string().length(2).optional(),
});
