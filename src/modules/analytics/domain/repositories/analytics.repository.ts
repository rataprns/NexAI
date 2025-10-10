
import { MessageIntent } from "@/modules/analytics/domain/entities/message-intent.entity";
import { MessageSentiment, MessageUrgency, MessageInteractionType } from "../entities/message-sentiment.entity";
import { MessageAnalytic } from "../entities/message-analytic.entity";

export interface IAnalyticsRepository {
  create(data: {
    senderId: string;
    channel: string;
    message: string;
    intent: MessageIntent;
    sentiment: MessageSentiment;
    urgency: MessageUrgency;
    interactionType: MessageInteractionType;
  }): Promise<MessageAnalytic>;
}
