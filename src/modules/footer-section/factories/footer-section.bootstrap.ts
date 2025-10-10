
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createFooterSectionRepository } from './footer-section-repository.factory';
import { createFooterSectionService } from './footer-section-service.factory';

export function bootstrapFooterSectionModule(): void {
  container.register(SERVICE_KEYS.FooterSectionRepository, createFooterSectionRepository);
  container.register(SERVICE_KEYS.FooterSectionService, createFooterSectionService);
}
