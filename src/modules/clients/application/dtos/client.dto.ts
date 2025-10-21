
import { z } from 'zod';
import { ClientType } from '../../domain/entities/client-type.enum';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  email: z.string().email('Invalid email address').optional(),
  senderId: z.string().optional(),
  type: z.nativeEnum(ClientType).optional(),
  channel: z.string().optional(),
  secretWord1: z.string().optional(),
  secretWord2: z.string().optional(),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
