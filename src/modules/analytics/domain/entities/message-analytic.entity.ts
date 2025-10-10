
import { MessageIntent } from "./message-intent.entity";
import { MessageSentiment, MessageUrgency, MessageInteractionType } from "./message-sentiment.entity";

export class MessageAnalytic {
    id: string;
    senderId: string;
    channel: string;
    message: string;
    intent: MessageIntent;
    sentiment: MessageSentiment;
    urgency: MessageUrgency;
    interactionType: MessageInteractionType;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(
        id: string,
        senderId: string,
        channel: string,
        message: string,
        intent: MessageIntent,
        sentiment: MessageSentiment,
        urgency: MessageUrgency,
        interactionType: MessageInteractionType,
        createdAt: Date,
        updatedAt: Date,
    ) {
      this.id = id;
      this.senderId = senderId;
      this.channel = channel;
      this.message = message;
      this.intent = intent;
      this.sentiment = sentiment;
      this.urgency = urgency;
      this.interactionType = interactionType;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
}
