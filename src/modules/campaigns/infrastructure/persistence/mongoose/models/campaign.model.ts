
import mongoose, { Schema, Document } from 'mongoose';
import { CampaignStatus } from '@/modules/campaigns/domain/entities/campaign.entity';

export interface ICampaign extends Document {
  name: string;
  description: string;
  slug: string;
  status: CampaignStatus;
  generatedTitle: string;
  generatedSubtitle: string;
  generatedBody: string;
  chatbotInitialMessage: string;
  chatbotConversionGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: Object.values(CampaignStatus), default: CampaignStatus.DRAFT },
  generatedTitle: { type: String, default: '' },
  generatedSubtitle: { type: String, default: '' },
  generatedBody: { type: String, default: '' },
  chatbotInitialMessage: { type: String, default: '' },
  chatbotConversionGoal: { type: String, default: '' },
}, { timestamps: true });

export const CampaignModel = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
