
import mongoose, { Schema, Document } from 'mongoose';
import { EmailTemplateType } from '@/modules/email-templates/domain/entities/email-template.entity';

export interface IEmailTemplate extends Document {
  type: EmailTemplateType;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema({
  type: { type: String, enum: Object.values(EmailTemplateType), required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
}, { timestamps: true });

export const EmailTemplateModel = mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
