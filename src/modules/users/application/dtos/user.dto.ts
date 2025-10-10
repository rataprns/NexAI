import { z } from 'zod';
import { UserRole } from '../../domain/entities/user-role.enum';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.nativeEnum(UserRole).optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional().or(z.literal('')),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
