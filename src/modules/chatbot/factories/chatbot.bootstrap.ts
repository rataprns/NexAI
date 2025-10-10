
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createChatbotService } from './chatbot-service.factory';
import { createConversationHistoryRepository } from './conversation-history-repository.factory';
import { createConversationHistoryService } from './conversation-history-service.factory';
import '@/ai/flows/get-normalized-date-tool';

export function bootstrapChatbotModule(): void {
  container.register(SERVICE_KEYS.ChatbotService, createChatbotService);
  container.register(SERVICE_KEYS.ConversationHistoryRepository, createConversationHistoryRepository);
  container.register(SERVICE_KEYS.ConversationHistoryService, createConversationHistoryService);
}
