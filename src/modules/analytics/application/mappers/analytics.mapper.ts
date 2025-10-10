
import { MessageAnalytic } from "../../domain/entities/message-analytic.entity";
import { ToolCallAnalytic } from "../../domain/entities/tool-call-analytic.entity";
import { IMessageAnalytic } from "../../infrastructure/persistence/mongoose/models/message-analytic.model";
import { IToolCallAnalytic } from "../../infrastructure/persistence/mongoose/models/tool-call-analytic.model";

export class AnalyticsMapper {
  static toMessageDomain(doc: IMessageAnalytic): MessageAnalytic {
    return new MessageAnalytic(
      doc._id.toString(),
      doc.senderId,
      doc.channel,
      doc.message,
      doc.intent,
      doc.sentiment,
      doc.urgency,
      doc.interactionType,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toToolCallDomain(doc: IToolCallAnalytic): ToolCallAnalytic {
    return new ToolCallAnalytic(
      doc._id.toString(),
      doc.senderId,
      doc.channel,
      doc.toolName,
      doc.input,
      doc.wasSuccessful,
      doc.outputMessage,
      doc.createdAt
    );
  }
}
