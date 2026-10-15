import { z } from 'zod';

export const CreateStaffBodySchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().min(8).max(20),
  name: z.string().min(2).max(100),
  displayName: z.string().max(100).optional(),
  countryId: z.string().min(2).max(10),
  countryName: z.string().min(2).max(100).default('Kenya'),
  currency: z.string().length(3).default('KES'),
  role: z.enum(['ceo', 'admin', 'manager', 'customercare']),
  password: z.string().min(8).max(100),
});

export type CreateStaffBody = z.infer<typeof CreateStaffBodySchema>;
