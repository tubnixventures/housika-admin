import { z } from 'zod';

export const StaffDetailParamSchema = z.object({
  id: z.string().startsWith('acc_'),
});
