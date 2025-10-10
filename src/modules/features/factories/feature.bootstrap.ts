
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createFeatureRepository } from './feature-repository.factory';
import { createFeatureService } from './feature-service.factory';

export function bootstrapFeatureModule(): void {
  container.register(SERVICE_KEYS.FeatureRepository, createFeatureRepository);
  container.register(SERVICE_KEYS.FeatureService, createFeatureService);
}
