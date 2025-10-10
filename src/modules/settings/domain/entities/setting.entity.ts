
export interface LandingPageSettings {
    showFeatures: boolean;
    showTestimonials: boolean;
    showFaq: boolean;
    showContact: boolean;
    showAppointments: boolean;
    showServices?: boolean;
    showLanguageSelector?: boolean;
    sectionOrder: string[];
}

export interface ChannelCredentials {
    webhookVerifyToken?: string;
    accessToken?: string;
    appSecret?: string;
    fromNumberId?: string; // Specifically for WhatsApp
}

export interface IntegrationsSettings {
    whatsapp: ChannelCredentials;
    messenger: ChannelCredentials;
    instagram: ChannelCredentials;
}

export class Setting {
    id: string;
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
    landingPage: LandingPageSettings;
    integrations: IntegrationsSettings;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      appName: string,
      knowledgeBase: string,
      chatbotInitialMessage: string,
      theme: string,
      contactEmail: string,
      logoUrl: string | undefined,
      logoIconName: string | undefined,
      isIconLogo: boolean | undefined,
      timezone: string,
      plugin: string | undefined,
      model: string | undefined,
      landingPage: LandingPageSettings,
      integrations: IntegrationsSettings,
      createdAt: Date,
      updatedAt: Date
    ) {
      this.id = id;
      this.appName = appName;
      this.knowledgeBase = knowledgeBase;
      this.chatbotInitialMessage = chatbotInitialMessage;
      this.theme = theme;
      this.contactEmail = contactEmail;
      this.logoUrl = logoUrl;
      this.logoIconName = logoIconName;
      this.isIconLogo = isIconLogo;
      this.timezone = timezone;
      this.plugin = plugin;
      this.model = model;
      this.landingPage = landingPage;
      this.integrations = integrations;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
