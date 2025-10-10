
import { z } from 'zod';

const channelCredentialsSchema = z.object({
  webhookVerifyToken: z.string().optional(),
  accessToken: z.string().optional(),
  appSecret: z.string().optional(),
  fromNumberId: z.string().optional(), // Added for WhatsApp
}).optional();

export const updateSettingSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  knowledgeBase: z.string().optional(),
  chatbotInitialMessage: z.string().optional(),
  theme: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  logoUrl: z.string().optional(),
  logoIconName: z.string().optional(),
  isIconLogo: z.boolean().optional(),
  timezone: z.string().min(1, "Timezone is required").optional(),
  plugin: z.string().optional(),
  model: z.string().optional(),
  landingPage: z.object({
    showFeatures: z.boolean(),
    showTestimonials: z.boolean(),
    showFaq: z.boolean(),
    showContact: z.boolean(),
    showAppointments: z.boolean(),
    showServices: z.boolean().optional(),
    showLanguageSelector: z.boolean().optional(),
    sectionOrder: z.array(z.string()),
  }),
  integrations: z.object({
    whatsapp: channelCredentialsSchema,
    messenger: channelCredentialsSchema,
    instagram: channelCredentialsSchema,
  }).optional(),
});

export type UpdateSettingDto = z.infer<typeof updateSettingSchema>;
