
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createHeroSectionRepository } from './hero-section-repository.factory';
import { createHeroSectionService } from './hero-section-service.factory';

export function bootstrapHeroSectionModule(): void {
  container.register(SERVICE_KEYS.HeroSectionRepository, createHeroSectionRepository);
  container.register(SERVICE_KEYS.HeroSectionService, createHeroSectionService);
}
