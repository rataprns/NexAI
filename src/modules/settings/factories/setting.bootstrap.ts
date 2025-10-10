
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createSettingRepository } from './setting-repository.factory';
import { createSettingService } from './setting-service.factory';

export function bootstrapSettingModule(): void {
  container.register(SERVICE_KEYS.SettingRepository, createSettingRepository);
  container.register(SERVICE_KEYS.SettingService, createSettingService);
}
