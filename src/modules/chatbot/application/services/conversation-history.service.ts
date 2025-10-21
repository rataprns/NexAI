
import { IConversationHistoryRepository } from '../../domain/repositories/conversation-history.repository';
import { IConversationHistoryService } from '../../domain/services/conversation-history.service.interface';
import { ConversationHistory, ChatMessage } from '../../domain/entities/conversation-history.entity';
import { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';


const HISTORY_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

export class ConversationHistoryService implements IConversationHistoryService {
  constructor(private readonly repository: IConversationHistoryRepository) {}
  
   private getClientService(): IClientService {
    return resolve<IClientService>(SERVICE_KEYS.ClientService);
  }

  async findByClientId(clientId: string): Promise<ConversationHistory | null> {
    const client = await this.getClientService().findClientById(clientId);
    if (!client?.senderId) return null;
    return this.repository.findBySenderId(client.senderId);
  }

  async getHistory(senderId: string): Promise<ChatMessage[]> {
    const now = new Date();
    const conversation = await this.repository.findBySenderId(senderId);

    if (conversation && (now.getTime() - new Date(conversation.lastInteraction).getTime()) > HISTORY_EXPIRATION_MS) {
        // Instead of deleting, just return an empty array for expired sessions.
        // This prevents loss of history if a user returns after a short break.
        // A separate cron job should handle actual deletion of old records.
        return [];
    }

    return conversation ? conversation.history : [];
  }

  async updateHistory(senderId: string, userMessage: string, botMessage: string): Promise<void> {
    const existingConversation = await this.repository.findBySenderId(senderId);
    
    const newHistory: ChatMessage[] = [
      ...(existingConversation?.history || []),
      new ChatMessage('user', userMessage),
      new ChatMessage('bot', botMessage),
    ];

    const conversation = new ConversationHistory(
      existingConversation?.id || '', // ID will be set by the repository on upsert
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
