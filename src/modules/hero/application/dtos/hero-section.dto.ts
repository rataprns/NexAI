
import { z } from 'zod';

export const updateHeroSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  ctaButton1Text: z.string().min(1, "CTA Button 1 text is required"),
  ctaButton2Text: z.string().min(1, "CTA Button 2 text is required"),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  containerStyles: z.string().optional(),
  gridStyles: z.string().optional(),
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
});

export type UpdateHeroSectionDto = z.infer<typeof updateHeroSectionSchema>;
