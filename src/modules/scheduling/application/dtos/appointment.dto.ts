
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  locationId: z.string().min(1, "Location is required"),
  serviceId: z.string().min(1, "Service is required"),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;

export const createPublicAppointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  locationId: z.string().min(1, "Location is required"),
  serviceId: z.string().min(1, "Service is required"),
});

export type CreatePublicAppointmentDto = z.infer<typeof createPublicAppointmentSchema>;
