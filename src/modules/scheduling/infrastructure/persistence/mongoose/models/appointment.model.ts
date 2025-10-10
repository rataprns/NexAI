
import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus } from '@/lib/types';

export interface IAppointment extends Document {
  clientId: mongoose.Types.ObjectId;
  locationId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  date: Date;
  status: AppointmentStatus;
  name?: string;
  email?: string;
}

const AppointmentSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  date: { type: Date, required: true },
  status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.Scheduled },
  name: { type: String },
  email: { type: String },
}, { timestamps: true });

export const AppointmentModel = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
