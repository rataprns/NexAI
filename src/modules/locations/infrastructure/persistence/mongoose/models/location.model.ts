
import mongoose, { Schema, Document } from 'mongoose';

const AvailabilitySchema: Schema = new Schema({
    availableDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    availableTimes: { type: [String], default: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"] },
    disabledDates: { type: [String], default: [] },
}, { _id: false });

export interface ILocation extends Document {
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  availability: {
    availableDays: number[];
    availableTimes: string[];
    disabledDates: string[];
  };
  serviceIds: (mongoose.Types.ObjectId | string)[];
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  availability: { type: AvailabilitySchema, default: () => ({}) },
  serviceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
}, { timestamps: true });

export const LocationModel = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
