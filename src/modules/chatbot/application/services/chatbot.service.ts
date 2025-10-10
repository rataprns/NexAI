
import { IChatbotService } from "../../domain/services/chatbot.service.interface";
import { helpMeChooseBestProduct } from "@/ai/flows/help-me-choose-best-product";
import { chatbotAnswerQuestions } from "@/ai/flows/chatbot-answer-questions";
import { improveText } from "@/ai/flows/improve-text";
import { generateText } from "@/ai/flows/generate-text";
import { classifyMessageIntent } from "@/ai/flows/classify-message-intent";
import { analyzeMessageSentiment } from "@/ai/flows/analyze-message-sentiment";
import { resolve } from "@/services/bootstrap";
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ISchedulingService } from "@/modules/scheduling/domain/services/scheduling.service.interface";
import { IClientService } from "@/modules/clients/domain/services/client.service.interface";
import { ISecretWordService } from "@/modules/security/domain/services/secret-word.service.interface";
import { IServiceService } from "@/modules/services/domain/services/service.service.interface";
import { ILocationService } from "@/modules/locations/domain/services/location.service.interface";

const flows: Record<string, (input: any) => Promise<any>> = {
    helpMeChooseBestProduct,
    chatbotAnswerQuestions,
    improveText,
    generateText,
    classifyMessageIntent,
    analyzeMessageSentiment,
};

export class ChatbotService implements IChatbotService {
    private getSettingService(): ISettingService {
        return resolve<ISettingService>(SERVICE_KEYS.SettingService);
    }
    private getSchedulingService(): ISchedulingService {
        return resolve<ISchedulingService>(SERVICE_KEYS.SchedulingService);
    }
    private getClientService(): IClientService {
        return resolve<IClientService>(SERVICE_KEYS.ClientService);
    }
    private getSecretWordService(): ISecretWordService {
        return resolve<ISecretWordService>(SERVICE_KEYS.SecretWordService);
    }
    private getServiceService(): IServiceService {
        return resolve<IServiceService>(SERVICE_KEYS.ServiceService);
    }
    private getLocationService(): ILocationService {
        return resolve<ILocationService>(SERVICE_KEYS.LocationService);
    }

    async runFlow(flowName: string, input: any): Promise<any> {
        const flow = flows[flowName];
        if (!flow) {
            throw new Error(`Flow "${flowName}" not found.`);
        }

        if (flowName === 'chatbotAnswerQuestions') {
             const settingService = this.getSettingService();
             const schedulingService = this.getSchedulingService();
             const clientService = this.getClientService();
             const secretWordService = this.getSecretWordService();
             const serviceService = this.getServiceService();
             const locationService = this.getLocationService();

             const settings = await settingService.getSettings();
             const allServices = await serviceService.findAllActiveServices();
             const allLocations = await locationService.findAllActiveLocations();
             
             const appName = settings?.appName || 'the company';
             let knowledgeBase = settings?.knowledgeBase || 'No knowledge base provided.';

            // Dynamically build knowledge base about locations and their specific services
            if (allLocations.length > 0) {
                const locationsPreamble = "\n\n## Available Locations and Services:\n\n";
                const locationsDetails = allLocations.map(location => {
                    const availableServices = allServices
                        .filter(service => service.locationIds.includes(location.id))
                        .map(service => (
                            `### Service: ${service.name}\n` +
                            `- Description: ${service.description}\n` +
                            `- Duration: ${service.duration} minutes\n` +
                            `- Price: ${service.price} ${service.currency}\n`
                        ))
                        .join('\n');
                    
                    let locationInfo = `**Location: ${location.name}**\nAddress: ${location.address || 'Not specified'}\nPhone: ${location.phone || 'Not specified'}`;
                    if (availableServices) {
                        locationInfo += `\n\n**Services Offered at ${location.name}:**\n${availableServices}`;
                    } else {
                        locationInfo += `\nServices Offered: No specific services listed for this location.`;
                    }
                    return locationInfo;
                }).join('\n\n---\n\n');
                knowledgeBase += locationsPreamble + locationsDetails;
            }


             const flowInput = {
                prompt: input.prompt,
                history: input.history || [],
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

        return await flow(input);
    }
}
