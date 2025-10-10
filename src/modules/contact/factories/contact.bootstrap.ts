
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createContactService } from './contact-service.factory';

export function bootstrapContactModule(): void {
  container.register(SERVICE_KEYS.ContactService, createContactService, { lifecycle: 'transient' });
}
