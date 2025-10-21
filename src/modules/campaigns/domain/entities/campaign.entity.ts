
export enum CampaignStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
}

export class Campaign {
    id: string;
    name: string;
    description: string;
    slug: string;
    status: CampaignStatus;
    
    // Generated Content
    generatedTitle: string;
    generatedSubtitle: string;
    generatedBody: string;

    // Chatbot behavior
    chatbotInitialMessage: string;
    chatbotConversionGoal: string; // e.g., serviceId, 'contact', etc.

    createdAt: Date;
    updatedAt: Date;
  
    constructor(
      id: string,
      name: string,
      description: string,
      slug: string,
      status: CampaignStatus,
      generatedTitle: string,
      generatedSubtitle: string,
      generatedBody: string,
      chatbotInitialMessage: string,
      chatbotConversionGoal: string,
      createdAt: Date,
      updatedAt: Date
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.slug = slug;
      this.status = status;
      this.generatedTitle = generatedTitle;
      this.generatedSubtitle = generatedSubtitle;
      this.generatedBody = generatedBody;
      this.chatbotInitialMessage = chatbotInitialMessage;
      this.chatbotConversionGoal = chatbotConversionGoal;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
