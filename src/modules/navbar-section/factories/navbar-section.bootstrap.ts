
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createNavbarSectionRepository } from './navbar-section-repository.factory';
import { createNavbarSectionService } from './navbar-section-service.factory';

export function bootstrapNavbarSectionModule(): void {
  container.register(SERVICE_KEYS.NavbarSectionRepository, createNavbarSectionRepository);
  container.register(SERVICE_KEYS.NavbarSectionService, createNavbarSectionService);
}
