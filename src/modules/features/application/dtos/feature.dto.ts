
import { z } from 'zod';

export const featureItemSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const updateFeaturesSchema = z.object({
  badge: z.string().min(1, "Badge is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  items: z.array(featureItemSchema),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  containerStyles: z.string().optional(),
  gridStyles: z.string().optional(),
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
});

export type UpdateFeaturesDto = z.infer<typeof updateFeaturesSchema>;
export type FeatureItemDto = z.infer<typeof featureItemSchema>;
