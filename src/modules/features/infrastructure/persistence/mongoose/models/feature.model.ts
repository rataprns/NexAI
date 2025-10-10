
import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureItem extends Document {
  icon: string;
  title: string;
  description: string;
}

const FeatureItemSchema: Schema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });


export interface IFeaturesSection extends Document {
  badge: string;
  title: string;
  subtitle: string;
  items: IFeatureItem[];
  imageUrl?: string;
  containerStyles?: string;
  gridStyles?: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeaturesSectionSchema: Schema = new Schema({
  badge: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  items: [FeatureItemSchema],
  imageUrl: { type: String },
  containerStyles: { type: String },
  gridStyles: { type: String },
  titleColor: { type: String },
  subtitleColor: { type: String },
}, { timestamps: true });

export const FeaturesSectionModel = mongoose.models.FeaturesSection || mongoose.model<IFeaturesSection>('FeaturesSection', FeaturesSectionSchema);
