
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createServiceRepository } from './service-repository.factory';
import { createServiceService } from './service-service.factory';

export function bootstrapServiceModule(): void {
  container.register(SERVICE_KEYS.ServiceRepository, createServiceRepository);
  container.register(SERVICE_KEYS.ServiceService, createServiceService);
}
