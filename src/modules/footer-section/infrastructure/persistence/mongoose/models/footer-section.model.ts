
import mongoose, { Schema, Document } from 'mongoose';

const FooterLinkSchema: Schema = new Schema({
  text: { type: String, required: true },
  href: { type: String, required: true },
}, { _id: false });

const FooterLinkColumnSchema: Schema = new Schema({
    title: { type: String, required: true },
    links: [FooterLinkSchema],
}, { _id: false });

export interface IFooterSection extends Document {
  description: string;
  linkColumns: {
    title: string;
    links: { text: string; href: string }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FooterSectionSchema: Schema = new Schema({
  description: { type: String, required: true },
  linkColumns: [FooterLinkColumnSchema],
}, { timestamps: true });

export const FooterSectionModel = mongoose.models.FooterSection || mongoose.model<IFooterSection>('FooterSection', FooterSectionSchema);
