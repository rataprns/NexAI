
import dbConnect from '@/lib/db';
import { IAnalyticsRepository } from '@/modules/analytics/domain/repositories/analytics.repository';
import { MessageAnalytic } from '@/modules/analytics/domain/entities/message-analytic.entity';
import { MessageAnalyticModel } from '../models/message-analytic.model';
import { AnalyticsMapper } from '@/modules/analytics/application/mappers/analytics.mapper';
import { MessageIntent } from '@/modules/analytics/domain/entities/message-intent.entity';
import { MessageSentiment, MessageUrgency, MessageInteractionType } from '@/modules/analytics/domain/entities/message-sentiment.entity';

export class MongooseAnalyticsRepository implements IAnalyticsRepository {
  
  public async create(data: {
    senderId: string;
    channel: string;
    message: string;
    intent: MessageIntent;
    sentiment: MessageSentiment;
    urgency: MessageUrgency;
    interactionType: MessageInteractionType;
  }): Promise<MessageAnalytic> {
    await dbConnect();
    const newAnalytic = new MessageAnalyticModel(data);
    const savedAnalytic = await newAnalytic.save();
    return AnalyticsMapper.toMessageDomain(savedAnalytic);
  }
}

