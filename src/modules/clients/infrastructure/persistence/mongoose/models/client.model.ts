
import mongoose, { Schema, Document } from 'mongoose';
import { ClientType } from '@/modules/clients/domain/entities/client-type.enum';

export interface IClient extends Document {
  name: string;
  email?: string;
  senderId?: string;
  channel?: string;
  type: ClientType;
  secretWord1?: string;
  secretWord2?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, default: 'Anonymous Lead' },
  email: { type: String, unique: true, sparse: true },
  senderId: { type: String, unique: true, sparse: true },
  channel: { type: String },
  type: { type: String, enum: Object.values(ClientType), default: ClientType.LEAD },
  secretWord1: { type: String },
  secretWord2: { type: String },
}, { timestamps: true });

export const ClientModel = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
