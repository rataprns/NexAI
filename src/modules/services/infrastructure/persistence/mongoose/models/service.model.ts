
import mongoose, { Schema, Document } from 'mongoose';

const CustomFieldSchema: Schema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

export interface IService extends Document {
  name: string;
  description: string;
  isActive: boolean;
  imageUrl?: string;
  duration: number;
  price: number;
  offerPrice?: number;
  currency: string;
  customFields: { label: string, value: string }[];
  locationIds: (mongoose.Types.ObjectId | string)[];
  campaignId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number },
  currency: { type: String, required: true, default: 'USD' },
  customFields: [CustomFieldSchema],
  locationIds: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', null: true },
}, { timestamps: true });

export const ServiceModel = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
