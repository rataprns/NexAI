
import mongoose, { Schema, Document } from 'mongoose';
import { MessageIntent, MessageIntentEnum } from '@/modules/analytics/domain/entities/message-intent.entity';
import { 
  MessageSentiment, MessageSentimentEnum,
  MessageUrgency, MessageUrgencyEnum,
  MessageInteractionType, MessageInteractionTypeEnum
} from '@/modules/analytics/domain/entities/message-sentiment.entity';

export interface IMessageAnalytic extends Document {
  senderId: string;
  channel: string;
  message: string;
  intent: MessageIntent;
  sentiment: MessageSentiment;
  urgency: MessageUrgency;
  interactionType: MessageInteractionType;
  createdAt: Date;
  updatedAt: Date;
}

const MessageAnalyticSchema: Schema = new Schema({
  senderId: { type: String, required: true, index: true },
  channel: { type: String, required: true },
  message: { type: String, required: true },
  intent: { type: String, enum: MessageIntentEnum.options, required: true },
  sentiment: { type: String, enum: MessageSentimentEnum.options, required: true },
  urgency: { type: String, enum: MessageUrgencyEnum.options, required: true },
  interactionType: { type: String, enum: MessageInteractionTypeEnum.options, required: true },
}, { timestamps: true });

export const MessageAnalyticModel = mongoose.models.MessageAnalytic || mongoose.model<IMessageAnalytic>('MessageAnalytic', MessageAnalyticSchema);
