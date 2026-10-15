import { z } from 'zod';

export const StaffListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  role: z.enum(['ceo', 'admin', 'manager', 'customercare']).optional(),
  status: z.enum(['active', 'pending_verification', 'suspended']).optional(),
  search: z.string().optional(),
});
