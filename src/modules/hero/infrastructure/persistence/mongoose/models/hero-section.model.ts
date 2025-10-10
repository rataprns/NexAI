
import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSection extends Document {
  title: string;
  subtitle: string;
  ctaButton1Text: string;
  ctaButton1Href?: string;
  ctaButton2Text: string;
  ctaButton2Href?: string;
  imageUrl?: string;
  containerStyles?: string;
  gridStyles?: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  ctaButton1Text: { type: String, required: true },
  ctaButton1Href: { type: String },
  ctaButton2Text: { type: String, required: true },
  ctaButton2Href: { type: String },
  imageUrl: { type: String },
  containerStyles: { type: String },
  gridStyles: { type: String },
  titleColor: { type: String },
  subtitleColor: { type: String },
}, { timestamps: true });

export const HeroSectionModel = mongoose.models.HeroSection || mongoose.model<IHeroSection>('HeroSection', HeroSectionSchema);
