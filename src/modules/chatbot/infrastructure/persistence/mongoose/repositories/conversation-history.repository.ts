
import dbConnect from '@/lib/db';
import { ConversationHistory } from '@/modules/chatbot/domain/entities/conversation-history.entity';
import { IConversationHistoryRepository } from '@/modules/chatbot/domain/repositories/conversation-history.repository';
import { ConversationHistoryModel } from '../models/conversation-history.model';
import { ConversationHistoryMapper } from '@/modules/chatbot/application/mappers/conversation-history.mapper';

export class MongooseConversationHistoryRepository implements IConversationHistoryRepository {
  public async findBySenderId(senderId: string): Promise<ConversationHistory | null> {
    await dbConnect();
    const doc = await ConversationHistoryModel.findOne({ senderId });
    return doc ? ConversationHistoryMapper.toDomain(doc) : null;
  }

  public async upsert(conversation: ConversationHistory): Promise<void> {
    await dbConnect();
    await ConversationHistoryModel.updateOne(
      { senderId: conversation.senderId },
      {
        $set: {
          history: conversation.history,
          lastInteraction: conversation.lastInteraction,
        },
      },
      { upsert: true }
    );
  }

  public async deleteExpired(expirationDate: Date): Promise<void> {
    await dbConnect();
    await ConversationHistoryModel.deleteMany({
      lastInteraction: { $lt: expirationDate },
    });
  }

  public async deleteById(id: string): Promise<void> {
    await dbConnect();
    await ConversationHistoryModel.findByIdAndDelete(id);
  }
}
