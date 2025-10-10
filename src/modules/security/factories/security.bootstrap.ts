
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createSecretWordRepository } from './secret-word-repository.factory';
import { createSecretWordService } from './secret-word-service.factory';

export function bootstrapSecurityModule(): void {
  container.register(SERVICE_KEYS.SecretWordRepository, createSecretWordRepository);
  container.register(SERVICE_KEYS.SecretWordService, createSecretWordService);
}
