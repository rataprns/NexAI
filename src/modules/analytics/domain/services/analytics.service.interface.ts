
import { MessageAnalytic } from "../entities/message-analytic.entity";
import { ToolCallAnalytic } from "../entities/tool-call-analytic.entity";

export interface IAnalyticsService {
  classifyAndSave(message: string, senderId: string, channel: string): Promise<MessageAnalytic | null>;
  logToolCall(data: {
    senderId: string;
    channel: string;
    toolName: string;
    input: any;
    wasSuccessful: boolean;
    outputMessage: string;
  }): Promise<ToolCallAnalytic>;
}
