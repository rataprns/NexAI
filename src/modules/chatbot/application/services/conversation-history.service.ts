
import { IConversationHistoryRepository } from '../../domain/repositories/conversation-history.repository';
import { IConversationHistoryService } from '../../domain/services/conversation-history.service.interface';
import { ConversationHistory, ChatMessage } from '../../domain/entities/conversation-history.entity';

const HISTORY_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

export class ConversationHistoryService implements IConversationHistoryService {
  constructor(private readonly repository: IConversationHistoryRepository) {}

  async getHistory(senderId: string): Promise<ChatMessage[]> {
    const now = new Date();
    const conversation = await this.repository.findBySenderId(senderId);

    if (conversation && (now.getTime() - new Date(conversation.lastInteraction).getTime()) > HISTORY_EXPIRATION_MS) {
        await this.repository.deleteById(conversation.id);
        return [];
    }

    return conversation ? conversation.history : [];
  }

  async updateHistory(senderId: string, userMessage: string, botMessage: string): Promise<void> {
    const existingConversation = await this.getHistory(senderId);
    
    const newHistory: ChatMessage[] = [
      ...(existingConversation || []),
      new ChatMessage('user', userMessage),
      new ChatMessage('bot', botMessage),
    ];

    const conversation = new ConversationHistory(
      '', // ID will be set by the repository
      senderId,
      newHistory,
      new Date()
    );

    await this.repository.upsert(conversation);
  }

  async clearExpiredHistories(): Promise<void> {
    const expirationDate = new Date(Date.now() - HISTORY_EXPIRATION_MS);
    await this.repository.deleteExpired(expirationDate);
  }
}
