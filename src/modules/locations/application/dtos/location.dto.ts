
import { z } from 'zod';

const availabilitySchema = z.object({
  availableDays: z.array(z.number()).optional(),
  availableTimes: z.array(z.string()).optional(),
  disabledDates: z.array(z.union([z.string(), z.date()])).optional(),
});

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  availability: availabilitySchema.optional(),
  serviceIds: z.array(z.string()).optional(),
});

export const updateLocationSchema = locationSchema.extend({
  id: z.string()
});

export type LocationDto = z.infer<typeof locationSchema>;
export type UpdateLocationDto = z.infer<typeof updateLocationSchema>;
