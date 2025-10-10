
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createClientRepository } from './client-repository.factory';
import { createClientService } from './client-service.factory';
import { createClientController } from './client-controller.factory';

export function bootstrapClientModule(): void {
  container.register(SERVICE_KEYS.ClientRepository, createClientRepository);
  container.register(SERVICE_KEYS.ClientService, createClientService);
  container.register(SERVICE_KEYS.ClientController, createClientController);
}
