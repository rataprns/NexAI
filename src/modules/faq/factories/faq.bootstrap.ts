
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createFaqRepository } from './faq-repository.factory';
import { createFaqService } from './faq-service.factory';

export function bootstrapFaqModule(): void {
  container.register(SERVICE_KEYS.FaqRepository, createFaqRepository);
  container.register(SERVICE_KEYS.FaqService, createFaqService);
}
