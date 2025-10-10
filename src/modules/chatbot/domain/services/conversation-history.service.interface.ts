
import { ChatMessage } from "../entities/conversation-history.entity";

export interface IConversationHistoryService {
    getHistory(senderId: string): Promise<ChatMessage[]>;
    updateHistory(senderId: string, userMessage: string, botMessage: string): Promise<void>;
    clearExpiredHistories(): Promise<void>;
}
