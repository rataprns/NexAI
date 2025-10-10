
import mongoose, { Schema, Document } from 'mongoose';

const NavbarLinkSchema: Schema = new Schema({
  text: { type: String, required: true },
  href: { type: String, required: true },
  visible: { type: Boolean, default: true },
}, { _id: false });

export interface INavbarSection extends Document {
  links: { text: string; href: string; visible: boolean }[];
  containerStyles?: string;
  navStyles?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NavbarSectionSchema: Schema = new Schema({
  links: [NavbarLinkSchema],
  containerStyles: { type: String },
  navStyles: { type: String },
}, { timestamps: true });

export const NavbarSectionModel = mongoose.models.NavbarSection || mongoose.model<INavbarSection>('NavbarSection', NavbarSectionSchema);
