
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createContactSectionRepository } from './contact-section-repository.factory';
import { createContactSectionService } from './contact-section-service.factory';

export function bootstrapContactSectionModule(): void {
  container.register(SERVICE_KEYS.ContactSectionRepository, createContactSectionRepository);
  container.register(SERVICE_KEYS.ContactSectionService, createContactSectionService);
}
