
import { ConversationHistory } from '../entities/conversation-history.entity';

export interface IConversationHistoryRepository {
  findBySenderId(senderId: string): Promise<ConversationHistory | null>;
  upsert(conversation: ConversationHistory): Promise<void>;
  deleteExpired(expirationDate: Date): Promise<void>;
  deleteById(id: string): Promise<void>;
}
