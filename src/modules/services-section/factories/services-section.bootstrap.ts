
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createServicesSectionRepository } from './services-section-repository.factory';
import { createServicesSectionService } from './services-section-service.factory';

export function bootstrapServicesSectionModule(): void {
  container.register(SERVICE_KEYS.ServicesSectionRepository, createServicesSectionRepository);
  container.register(SERVICE_KEYS.ServicesSectionService, createServicesSectionService);
}
