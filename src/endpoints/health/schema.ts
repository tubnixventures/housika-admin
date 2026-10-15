import { z } from 'zod';

export const HealthQuerySchema = z.object({
  checkDependencies: z.string().optional(),
});
