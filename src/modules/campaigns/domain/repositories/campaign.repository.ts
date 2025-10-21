
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto } from '../../application/dtos/campaign.dto';

export interface ICampaignRepository {
  create(dto: CreateCampaignDto): Promise<Campaign>;
  update(dto: UpdateCampaignDto): Promise<Campaign | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Campaign | null>;
  findBySlug(slug: string): Promise<Campaign | null>;
  findAll(): Promise<Campaign[]>;
}
