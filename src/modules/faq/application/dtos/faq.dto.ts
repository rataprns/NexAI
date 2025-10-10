
import { z } from 'zod';

export const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const updateFaqSchema = z.object({
  badge: z.string().min(1, "Badge is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  items: z.array(faqItemSchema),
  containerStyles: z.string().optional(),
  gridStyles: z.string().optional(),
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
});

export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
export type FaqItemDto = z.infer<typeof faqItemSchema>;
