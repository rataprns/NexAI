
import { z } from 'zod';

export const navbarLinkSchema = z.object({
  text: z.string().min(1, "Link text is required"),
  href: z.string().min(1, "Link URL is required"),
  visible: z.boolean().optional(),
});

export const updateNavbarSectionSchema = z.object({
  links: z.array(navbarLinkSchema),
  containerStyles: z.string().optional(),
  navStyles: z.string().optional(),
});

export type UpdateNavbarSectionDto = z.infer<typeof updateNavbarSectionSchema>;
