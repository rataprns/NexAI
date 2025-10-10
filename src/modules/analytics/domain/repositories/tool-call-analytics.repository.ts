
import { ToolCallAnalytic } from "../entities/tool-call-analytic.entity";

export interface IToolCallAnalyticsRepository {
  create(data: {
    senderId: string;
    channel: string;
    toolName: string;
    input: any;
    wasSuccessful: boolean;
    outputMessage: string;
  }): Promise<ToolCallAnalytic>;
}
