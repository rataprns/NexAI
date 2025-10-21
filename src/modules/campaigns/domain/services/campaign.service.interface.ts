
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto, GenerateCampaignContentDto, SuggestCampaignIdeaDto } from '../../application/dtos/campaign.dto';

export interface ICampaignService {
  createCampaign(dto: CreateCampaignDto): Promise<Campaign>;
  updateCampaign(dto: UpdateCampaignDto): Promise<Campaign | null>;
  deleteCampaign(id: string): Promise<void>;
  findCampaignById(id: string): Promise<Campaign | null>;
  findCampaignBySlug(slug: string): Promise<Campaign | null>;
  findAllCampaigns(): Promise<Campaign[]>;
  generateCampaignContent(dto: GenerateCampaignContentDto): Promise<any>;
  suggestCampaignIdea(dto: SuggestCampaignIdeaDto): Promise<any>;
}
