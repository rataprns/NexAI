
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createWhatsappService } from './whatsapp-service.factory';
import { createMessengerService } from './messenger-service.factory';
import { createInstagramService } from './instagram-service.factory';

export function bootstrapIntegrationsModule(): void {
  container.register(SERVICE_KEYS.WhatsappService, createWhatsappService);
  container.register(SERVICE_KEYS.MessengerService, createMessengerService);
  container.register(SERVICE_KEYS.InstagramService, createInstagramService);
}
