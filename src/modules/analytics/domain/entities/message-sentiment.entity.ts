
import { z } from 'zod';

export const MessageSentimentEnum = z.enum([
  'POSITIVE',
  'NEGATIVE',
  'NEUTRAL',
]);
export type MessageSentiment = z.infer<typeof MessageSentimentEnum>;

export const MessageUrgencyEnum = z.enum([
  'HIGH',
  'MEDIUM',
  'LOW',
]);
export type MessageUrgency = z.infer<typeof MessageUrgencyEnum>;

export const MessageInteractionTypeEnum = z.enum([
  'MAGIC_MOMENT',
  'FRICTION_MOMENT',
  'NEUTRAL',
]);
export type MessageInteractionType = z.infer<typeof MessageInteractionTypeEnum>;
