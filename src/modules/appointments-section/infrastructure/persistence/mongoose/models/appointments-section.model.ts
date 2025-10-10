
import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointmentsSection extends Document {
  badge: string;
  title: string;
  subtitle: string;
  containerStyles?: string;
  gridStyles?: string;
  titleColor?: string;
  subtitleColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentsSectionSchema: Schema = new Schema({
  badge: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  containerStyles: { type: String },
  gridStyles: { type: String },
  titleColor: { type: String },
  subtitleColor: { type: String },
}, { timestamps: true });

export const AppointmentsSectionModel = mongoose.models.AppointmentsSection || mongoose.model<IAppointmentsSection>('AppointmentsSection', AppointmentsSectionSchema);
