
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createEmailTemplateRepository } from './email-template-repository.factory';
import { createEmailTemplateService } from './email-template-service.factory';

export function bootstrapEmailTemplateModule(): void {
  container.register(SERVICE_KEYS.EmailTemplateRepository, createEmailTemplateRepository);
  container.register(SERVICE_KEYS.EmailTemplateService, createEmailTemplateService);
}
