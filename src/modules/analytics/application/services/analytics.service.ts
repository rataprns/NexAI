
import { IAnalyticsRepository } from "../../domain/repositories/analytics.repository";
import { IToolCallAnalyticsRepository } from "../../domain/repositories/tool-call-analytics.repository";
import { IAnalyticsService } from "../../domain/services/analytics.service.interface";
import { MessageAnalytic } from "../../domain/entities/message-analytic.entity";
import { ToolCallAnalytic } from "../../domain/entities/tool-call-analytic.entity";
import { resolve } from "@/services/bootstrap";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { IChatbotService } from "@/modules/chatbot/domain/services/chatbot.service.interface";

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly toolCallRepository: IToolCallAnalyticsRepository
    ) {}
  
  private getChatbotService(): IChatbotService {
    return resolve<IChatbotService>(SERVICE_KEYS.ChatbotService);
  }

  async classifyAndSave(message: string, senderId: string, channel: string): Promise<MessageAnalytic | null> {
    try {
      const chatbotService = this.getChatbotService();
      
      const [intentResponse, sentimentResponse] = await Promise.all([
        chatbotService.runFlow('classifyMessageIntent', { prompt: message }),
        chatbotService.runFlow('analyzeMessageSentiment', { prompt: message })
      ]);

      if (!intentResponse?.intent || !sentimentResponse) {
        console.error("Failed to get complete analysis for message:", message);
        return null;
      }
      
      const analytic = await this.analyticsRepository.create({
        message,
        senderId,
        channel,
        intent: intentResponse.intent,
        sentiment: sentimentResponse.sentiment,
        urgency: sentimentResponse.urgency,
        interactionType: sentimentResponse.interactionType,
      });

      return analytic;

    } catch (error) {
      console.error("Error during message classification and saving:", error);
      return null;
    }
  }

  async logToolCall(data: {
    senderId: string;
    channel: string;
    toolName: string;
    input: any;
    wasSuccessful: boolean;
    outputMessage: string;
  }): Promise<ToolCallAnalytic> {
    console.log('[DEBUG] AnalyticsService logToolCall received data:', data);
    try {
        const toolCall = await this.toolCallRepository.create(data);
        return toolCall;
    } catch (error) {
        console.error("Error logging tool call:", error);
        throw new Error("Failed to log tool call analytic.");
    }
  }
}
