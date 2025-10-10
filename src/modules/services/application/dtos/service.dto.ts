
import { z } from 'zod';

export const customFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
  imageUrl: z.string().url().optional().or(z.literal('')),
  duration: z.coerce.number().min(0, "Duration must be a positive number"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  currency: z.string().min(3, "Currency code must be 3 characters").max(3, "Currency code must be 3 characters").default('USD'),
  customFields: z.array(customFieldSchema).optional(),
  locationIds: z.array(z.string()).optional(),
});

export const updateServiceSchema = serviceSchema.extend({
  id: z.string()
});

export type ServiceDto = z.infer<typeof serviceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;
