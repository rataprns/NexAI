
import mongoose, { Schema, Document } from 'mongoose';

export interface IFaqItem extends Document {
  question: string;
  answer: string;
}

const FaqItemSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });


export interface IFaqSection extends Document {
  badge: string;
  title: string;
  subtitle: string;
  items: IFaqItem[];
  containerStyles?: string;
  gridStyles?: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSectionSchema: Schema = new Schema({
  badge: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  items: [FaqItemSchema],
  containerStyles: { type: String },
  gridStyles: { type: String },
  titleColor: { type: String },
  subtitleColor: { type: String },
}, { timestamps: true });

export const FaqSectionModel = mongoose.models.FaqSection || mongoose.model<IFaqSection>('FaqSection', FaqSectionSchema);
