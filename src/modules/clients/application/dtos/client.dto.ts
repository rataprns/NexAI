
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  secretWord1: z.string().optional(),
  secretWord2: z.string().optional(),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
