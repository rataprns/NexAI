
import { z } from 'zod';

// Define the possible intents as an enum for strong typing
export const MessageIntentEnum = z.enum([
  'APPOINTMENT_BOOKING',
  'APPOINTMENT_MANAGEMENT',
  'SERVICE_INQUIRY',
  'GREETING_INQUIRY',
  'COMPLAINT_ISSUE',
  'OFF_TOPIC',
  'OTHER',
]);

export type MessageIntent = z.infer<typeof MessageIntentEnum>;
