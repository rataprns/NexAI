
import { ConversationHistory, ChatMessage } from '../../domain/entities/conversation-history.entity';
import { IConversationHistory } from '../../infrastructure/persistence/mongoose/models/conversation-history.model';

export class ConversationHistoryMapper {
  static toDomain(doc: IConversationHistory): ConversationHistory {
    return new ConversationHistory(
      doc._id.toString(),
      doc.senderId,
      doc.history.map(item => new ChatMessage(item.role, item.text)),
      doc.lastInteraction
    );
  }
}
