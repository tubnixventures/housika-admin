import { z } from 'zod';

export const DashboardAnalyticsQuerySchema = z.object({
  range: z.enum(['24h', '7d', '30d', '90d']).default('7d'),
});
