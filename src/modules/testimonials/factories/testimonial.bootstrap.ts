
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createTestimonialRepository } from './testimonial-repository.factory';
import { createTestimonialService } from './testimonial-service.factory';

export function bootstrapTestimonialModule(): void {
  container.register(SERVICE_KEYS.TestimonialRepository, createTestimonialRepository);
  container.register(SERVICE_KEYS.TestimonialService, createTestimonialService);
}
