
import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  secretWord1?: string;
  secretWord2?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  secretWord1: { type: String },
  secretWord2: { type: String },
}, { timestamps: true });

export const ClientModel = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
