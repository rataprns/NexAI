
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createEmailService } from './email-service.factory';

export function bootstrapEmailModule(): void {
  container.register(SERVICE_KEYS.EmailService, createEmailService);
}
