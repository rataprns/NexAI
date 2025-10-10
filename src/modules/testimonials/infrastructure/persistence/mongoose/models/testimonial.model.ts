
import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonialItem extends Document {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

const TestimonialItemSchema: Schema = new Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  avatar: { type: String, required: true },
}, { _id: false });


export interface ITestimonialsSection extends Document {
  badge: string;
  title: string;
  subtitle: string;
  items: ITestimonialItem[];
  containerStyles?: string;
  gridStyles?: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialsSectionSchema: Schema = new Schema({
  badge: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  items: [TestimonialItemSchema],
  containerStyles: { type: String },
  gridStyles: { type: String },
  titleColor: { type: String },
  subtitleColor: { type: String },
}, { timestamps: true });

export const TestimonialsSectionModel = mongoose.models.TestimonialsSection || mongoose.model<ITestimonialsSection>('TestimonialsSection', TestimonialsSectionSchema);
