
import { z } from 'zod';
import { EmailTemplateType } from '../../domain/entities/email-template.entity';

export const updateEmailTemplateSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(EmailTemplateType),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
});

export type UpdateEmailTemplateDto = z.infer<typeof updateEmailTemplateSchema>;
