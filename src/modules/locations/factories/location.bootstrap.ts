
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createLocationRepository } from './location-repository.factory';
import { createLocationService } from './location-service.factory';

export function bootstrapLocationModule(): void {
  container.register(SERVICE_KEYS.LocationRepository, createLocationRepository);
  container.register(SERVICE_KEYS.LocationService, createLocationService);
}
