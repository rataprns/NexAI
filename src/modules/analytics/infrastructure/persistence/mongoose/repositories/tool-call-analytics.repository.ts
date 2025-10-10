
import dbConnect from '@/lib/db';
import { IToolCallAnalyticsRepository } from '@/modules/analytics/domain/repositories/tool-call-analytics.repository';
import { ToolCallAnalytic } from '@/modules/analytics/domain/entities/tool-call-analytic.entity';
import { ToolCallAnalyticModel } from '../models/tool-call-analytic.model';
import { AnalyticsMapper } from '@/modules/analytics/application/mappers/analytics.mapper';

export class MongooseToolCallAnalyticsRepository implements IToolCallAnalyticsRepository {
  
  public async create(data: {
    senderId: string;
    channel: string;
    toolName: string;
    input: any;
    wasSuccessful: boolean;
    outputMessage: string;
  }): Promise<ToolCallAnalytic> {
    console.log('[DEBUG] ToolCallAnalyticsRepository creating document with:', data);
    await dbConnect();
    const newAnalytic = new ToolCallAnalyticModel(data);
    const savedAnalytic = await newAnalytic.save();
    return AnalyticsMapper.toToolCallDomain(savedAnalytic);
  }
}
