
import mongoose, { Schema, Document } from 'mongoose';

export interface IToolCallAnalytic extends Document {
  senderId: string;
  channel: string;
  toolName: string;
  input: any;
  wasSuccessful: boolean;
  outputMessage: string;
  createdAt: Date;
}

const ToolCallAnalyticSchema: Schema = new Schema({
  senderId: { type: String, required: true, index: true },
  channel: { type: String, required: true },
  toolName: { type: String, required: true },
  input: { type: Schema.Types.Mixed },
  wasSuccessful: { type: Boolean, required: true },
  outputMessage: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ToolCallAnalyticModel = mongoose.models.ToolCallAnalytic || mongoose.model<IToolCallAnalytic>('ToolCallAnalytic', ToolCallAnalyticSchema);
