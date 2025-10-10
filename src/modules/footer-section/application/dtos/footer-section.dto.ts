
import { z } from 'zod';

export const footerLinkSchema = z.object({
  text: z.string().min(1, "Link text is required"),
  href: z.string().min(1, "Link URL is required"),
});

export const footerLinkColumnSchema = z.object({
  title: z.string().min(1, "Column title is required"),
  links: z.array(footerLinkSchema),
});

export const updateFooterSectionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  linkColumns: z.array(footerLinkColumnSchema),
});

export type UpdateFooterSectionDto = z.infer<typeof updateFooterSectionSchema>;
