
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { CampaignService } from "../application/services/campaign.service";
import { ICampaignRepository } from "../domain/repositories/campaign.repository";
import { ICampaignService } from '../domain/services/campaign.service.interface';

let instance: ICampaignService;

export function createCampaignService(): ICampaignService {
    if(!instance){
        const repository = container.resolve<ICampaignRepository>(SERVICE_KEYS.CampaignRepository);
        instance = new CampaignService(repository);
    }
    return instance;
}
