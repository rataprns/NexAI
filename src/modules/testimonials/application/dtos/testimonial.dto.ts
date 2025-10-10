
import { z } from 'zod';

export const testimonialItemSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  avatar: z.string().url("Avatar must be a valid URL"),
});

export const updateTestimonialsSchema = z.object({
  badge: z.string().min(1, "Badge is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  items: z.array(testimonialItemSchema),
  containerStyles: z.string().optional(),
  gridStyles: z.string().optional(),
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
});

export type UpdateTestimonialsDto = z.infer<typeof updateTestimonialsSchema>;
export type TestimonialItemDto = z.infer<typeof testimonialItemSchema>;
