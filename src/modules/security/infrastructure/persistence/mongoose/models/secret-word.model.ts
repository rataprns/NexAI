
import mongoose, { Schema, Document } from 'mongoose';

export interface ISecretWord extends Document {
  word1: string;
  word2: string;
  createdAt: Date;
  updatedAt: Date;
}

const SecretWordSchema: Schema = new Schema({
  word1: { type: String, required: true },
  word2: { type: String, required: true },
}, { timestamps: true });

// Create a compound index to ensure uniqueness of the pair, regardless of order.
// This is done on the repository level for simplicity with sorted words.
SecretWordSchema.index({ word1: 1, word2: 1 }, { unique: true });

export const SecretWordModel = mongoose.models.SecretWord || mongoose.model<ISecretWord>('SecretWord', SecretWordSchema);
