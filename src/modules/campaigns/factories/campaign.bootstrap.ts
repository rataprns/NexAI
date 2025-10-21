
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createCampaignRepository } from './campaign-repository.factory';
import { createCampaignService } from './campaign-service.factory';

export function bootstrapCampaignModule(): void {
  container.register(SERVICE_KEYS.CampaignRepository, createCampaignRepository);
  container.register(SERVICE_KEYS.CampaignService, createCampaignService);
}
