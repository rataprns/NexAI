
import mongoose, { Schema, Document } from 'mongoose';

const ChatMessageSchema: Schema = new Schema({
  role: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
}, { _id: false });

export interface IConversationHistory extends Document {
  senderId: string;
  history: { role: 'user' | 'bot'; text: string }[];
  lastInteraction: Date;
}

const ConversationHistorySchema: Schema = new Schema({
  senderId: { type: String, required: true, unique: true, index: true },
  history: [ChatMessageSchema],
  lastInteraction: { type: Date, required: true },
}, { timestamps: true });

export const ConversationHistoryModel = mongoose.models.ConversationHistory || mongoose.model<IConversationHistory>('ConversationHistory', ConversationHistorySchema);
