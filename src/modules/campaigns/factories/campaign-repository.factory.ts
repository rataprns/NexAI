
import { MongooseCampaignRepository } from "../infrastructure/persistence/mongoose/repositories/campaign.repository";
import { ICampaignRepository } from '../domain/repositories/campaign.repository';

let instance: ICampaignRepository;

export function createCampaignRepository(): ICampaignRepository {
    if(!instance){
        instance = new MongooseCampaignRepository();
    }
    return instance;
}
