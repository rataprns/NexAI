
import { z } from 'zod';
import { CampaignStatus } from '../../domain/entities/campaign.entity';

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  slug: z.string().min(1, "URL Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters long"),
});
export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;

export const generateCampaignContentDtoSchema = z.object({
    description: z.string(),
    language: z.string().optional(),
});
export type GenerateCampaignContentDto = z.infer<typeof generateCampaignContentDtoSchema>;

export const suggestCampaignIdeaDtoSchema = z.object({
    language: z.string().optional(),
});
export type SuggestCampaignIdeaDto = z.infer<typeof suggestCampaignIdeaDtoSchema>;


export const updateCampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Campaign name is required"),
  slug: z.string().min(1, "URL Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(1, "Description is required"),
  status: z.nativeEnum(CampaignStatus),
  generatedTitle: z.string().min(1, "Title is required"),
  generatedSubtitle: z.string().min(1, "Subtitle is required"),
  generatedBody: z.string().min(1, "Body is required"),
  chatbotInitialMessage: z.string().min(1, "Chatbot greeting is required"),
  chatbotConversionGoal: z.string().min(1, "Chatbot goal is required"),
});

export type UpdateCampaignDto = z.infer<typeof updateCampaignSchema>;
