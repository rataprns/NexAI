
import { z } from 'zod';

export const updateContactSectionSchema = z.object({
  badge: z.string().min(1, "Badge is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  containerStyles: z.string().optional(),
  gridStyles: z.string().optional(),
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
});

export type UpdateContactSectionDto = z.infer<typeof updateContactSectionSchema>;
