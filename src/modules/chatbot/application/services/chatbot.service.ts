
'use server';

import { helpMeChooseBestProduct } from "@/ai/flows/help-me-choose-best-product";
import { chatbotAnswerQuestions } from "@/ai/flows/chatbot-answer-questions";
import { improveText } from "@/ai/flows/improve-text";
import { generateText } from "@/ai/flows/generate-text";
import { classifyMessageIntent } from "@/ai/flows/classify-message-intent";
import { analyzeMessageSentiment } from "@/ai/flows/analyze-message-sentiment";
import { generateCampaignContent } from "@/ai/flows/generate-campaign-content";
import { suggestCampaignIdea } from "@/ai/flows/suggest-campaign-idea";
import { resolve } from '@/services/bootstrap';
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ISchedulingService } from "@/modules/scheduling/domain/services/scheduling.service.interface";
import { IClientService } from "@/modules/clients/domain/services/client.service.interface";
import { ISecretWordService } from "@/modules/security/domain/services/secret-word.service.interface";
import { IServiceService } from "@/modules/services/domain/services/service.service.interface";
import { ILocationService } from "@/modules/locations/domain/services/location.service.interface";
import { ICampaignService } from "@/modules/campaigns/domain/services/campaign.service.interface";
import { CampaignStatus } from "@/modules/campaigns/domain/entities/campaign.entity";

const flows: Record<string, (input: any) => Promise<any>> = {
    helpMeChooseBestProduct,
    chatbotAnswerQuestions,
    improveText,
    generateText,
    classifyMessageIntent,
    analyzeMessageSentiment,
    generateCampaignContent,
    suggestCampaignIdea,
};

export async function runFlow(flowName: string, input: any): Promise<any> {
    const flow = flows[flowName];
    if (!flow) {
        throw new Error(`Flow "${flowName}" not found.`);
    }

    if (flowName === 'chatbotAnswerQuestions') {
         const settingService = resolve<ISettingService>(SERVICE_KEYS.SettingService);
         const schedulingService = resolve<ISchedulingService>(SERVICE_KEYS.SchedulingService);
         const clientService = resolve<IClientService>(SERVICE_KEYS.ClientService);
         const secretWordService = resolve<ISecretWordService>(SERVICE_KEYS.SecretWordService);
         const serviceService = resolve<IServiceService>(SERVICE_KEYS.ServiceService);
         const locationService = resolve<ILocationService>(SERVICE_KEYS.LocationService);
         const campaignService = resolve<ICampaignService>(SERVICE_KEYS.CampaignService);

         const settings = await settingService.getSettings();
         const allServices = await serviceService.findAllActiveServices();
         const allLocations = await locationService.findAllActiveLocations();
         const allCampaigns = await campaignService.findAllCampaigns();
         
         const appName = settings?.appName || 'the company';
         let knowledgeBase = settings?.knowledgeBase || 'No knowledge base provided.';

        if (allLocations.length > 0) {
            const locationsPreamble = "\n\n## Available Locations and Services:\n\nThis is the list of our locations and the specific services offered at each one:\n";
            
            const locationsDetails = allLocations.map(location => {
                const availableServicesForLocation = allServices
                    .filter(service => service.locationIds.includes(location.id))
                    .map(service => 
`
- **Service**: ${service.name} (ID: ${service.id})
- Description: ${service.description}
- Duration: ${service.duration} minutes
- Price: ${service.price} ${service.currency}`
                    ).join('');

                return `
### Location: ${location.name} (ID: ${location.id})
Address: ${location.address || 'Not specified'}
Phone: ${location.phone || 'Not specified'}
**Services Offered at this location:**${availableServicesForLocation || ' No specific services listed for this location.'}
`;
            }).join('\n---\n');
            knowledgeBase += locationsPreamble + locationsDetails;
        }
        
        const activeCampaigns = allCampaigns.filter(c => c.status === CampaignStatus.PUBLISHED);
        if (activeCampaigns.length > 0) {
            const campaignsPreamble = "\n\n## Available Marketing Campaigns and Promotions:\n\nIf the user asks about offers, deals, or campaigns, use the following information to answer. Provide them with the link to the campaign page.\n";
            const campaignsDetails = activeCampaigns.map(campaign => `
- **Campaign Name**: ${campaign.name}
- **Description**: ${campaign.description}
- **Link**: /c/${campaign.slug}
`).join('');
            knowledgeBase += campaignsPreamble + campaignsDetails;
        }

         if (input.pathname && input.pathname.startsWith('/c/')) {
            const slug = input.pathname.split('/c/')[1];
            if (slug) {
                const campaign = await campaignService.findCampaignBySlug(slug);
                if (campaign) {
                    const campaignPreamble = `\n\n## CURRENT CAMPAIGN CONTEXT\nThe user is currently on the landing page for the "${campaign.name}" campaign. Use this information to provide contextual answers.`;
                    const campaignDetails = `
- Campaign Name: ${campaign.name}
- Campaign Goal: ${campaign.description}
- Page Title: ${campaign.generatedTitle}
- Page Subtitle: ${campaign.generatedSubtitle}
- Page Body: ${campaign.generatedBody}
`;
                    knowledgeBase = campaignPreamble + campaignDetails + "\n---" + knowledgeBase;
                }
            }
         }

         const flowInput = {
            ...input,
            appName,
            knowledgeBase,
            language: input.language || 'en',
            services: {
                schedulingService,
                clientService,
                settingService,
                secretWordService,
                serviceService,
                locationService,
            }
         };

         return await flow(flowInput);
    }
    
    if (flowName === 'improveText') {
         const flowInput = {
            text: input.text,
            prompt: input.prompt,
         };
         return await flow(flowInput);
    }

    if (flowName === 'generateText' || flowName === 'classifyMessageIntent' || flowName === 'analyzeMessageSentiment') {
        const flowInput = {
            prompt: input.prompt,
        };
        return await flow(flowInput);
    }

    if (flowName === 'generateCampaignContent' || flowName === 'suggestCampaignIdea') {
        return await flow(input);
    }

    return await flow(input);
}
