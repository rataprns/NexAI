
import mongoose, { Schema, Document } from 'mongoose';

const LandingPageSchema: Schema = new Schema({
    showFeatures: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true },
    showFaq: { type: Boolean, default: true },
    showContact: { type: Boolean, default: true },
    showAppointments: { type: Boolean, default: true },
    showServices: { type: Boolean, default: true },
    showLanguageSelector: { type: Boolean, default: true },
    sectionOrder: { type: [String], default: ['heroSection', 'features', 'services', 'testimonials', 'appointments', 'faq', 'contact'] },
}, { _id: false });

const ChannelCredentialsSchema: Schema = new Schema({
    webhookVerifyToken: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    appSecret: { type: String, default: '' },
    fromNumberId: { type: String, default: '' }, // Added for WhatsApp
}, { _id: false });

const IntegrationsSchema: Schema = new Schema({
    whatsapp: { type: ChannelCredentialsSchema, default: () => ({}) },
    messenger: { type: ChannelCredentialsSchema, default: () => ({}) },
    instagram: { type: ChannelCredentialsSchema, default: () => ({}) },
}, { _id: false });

export interface ISetting extends Document {
  appName: string;
  knowledgeBase: string;
  chatbotInitialMessage: string;
  theme: string;
  contactEmail: string;
  logoUrl?: string;
  logoIconName?: string;
  isIconLogo?: boolean;
  timezone: string;
  plugin?: string;
  model?: string;
  landingPage: {
    showFeatures: boolean;
    showTestimonials: boolean;
    showFaq: boolean;
    showContact: boolean;
    showAppointments: boolean;
    showServices?: boolean;
    showLanguageSelector?: boolean;
    sectionOrder: string[];
  };
  integrations: {
    whatsapp: {
      webhookVerifyToken?: string;
      accessToken?: string;
      appSecret?: string;
      fromNumberId?: string;
    };
    messenger: {
      webhookVerifyToken?: string;
      accessToken?: string;
      appSecret?: string;
    };
    instagram: {
      webhookVerifyToken?: string;
      accessToken?: string;
      appSecret?: string;
    };
  };
}

const SettingSchema: Schema = new Schema({
  appName: { type: String, required: true, default: 'NexAI' },
  knowledgeBase: { type: String, default: '' },
  chatbotInitialMessage: { type: String, default: "Hello! I'm the {appName} assistant. How can I help you today?" },
  theme: { type: String, default: 'default' },
  contactEmail: { type: String, default: 'contact@example.com' },
  logoUrl: { type: String },
  logoIconName: { type: String, default: 'Mountain' },
  isIconLogo: { type: Boolean, default: true },
  timezone: { type: String, default: 'America/Santiago' },
  plugin: { type: String, default: 'googleai' },
  model: { type: String, default: 'gemini-1.5-flash' },
  landingPage: { type: LandingPageSchema, required: true },
  integrations: { type: IntegrationsSchema, default: () => ({}) }
}, { timestamps: true });

export const SettingModel = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
