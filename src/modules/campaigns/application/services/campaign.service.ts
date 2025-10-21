
import { ICampaignRepository } from '../../domain/repositories/campaign.repository';
import { ICampaignService } from '../../domain/services/campaign.service.interface';
import { Campaign } from '../../domain/entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto, GenerateCampaignContentDto, SuggestCampaignIdeaDto } from '../dtos/campaign.dto';
import { resolve } from '@/services/bootstrap';
import { IChatbotService } from '@/modules/chatbot/domain/services/chatbot.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { IServiceService } from '@/modules/services/domain/services/service.service.interface';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';

export class CampaignService implements ICampaignService {
  constructor(private readonly repository: ICampaignRepository) {}

  private getChatbotService(): IChatbotService {
    return resolve<IChatbotService>(SERVICE_KEYS.ChatbotService);
  }

  private getServiceService(): IServiceService {
    return resolve<IServiceService>(SERVICE_KEYS.ServiceService);
  }

  private getSettingService(): ISettingService {
    return resolve<ISettingService>(SERVICE_KEYS.SettingService);
  }

  async createCampaign(dto: CreateCampaignDto): Promise<Campaign> {
    return this.repository.create(dto);
  }

  async updateCampaign(dto: UpdateCampaignDto): Promise<Campaign | null> {
    return this.repository.update(dto);
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findCampaignById(id: string): Promise<Campaign | null> {
    return this.repository.findById(id);
  }
  
  async findCampaignBySlug(slug: string): Promise<Campaign | null> {
    return this.repository.findBySlug(slug);
  }

  async findAllCampaigns(): Promise<Campaign[]> {
    return this.repository.findAll();
  }

  async generateCampaignContent(dto: GenerateCampaignContentDto): Promise<any> {
    const services = await this.getServiceService().findAllActiveServices();
    const serviceList = services.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');
    
    const result = await this.getChatbotService().runFlow('generateCampaignContent', {
      description: dto.description,
      language: dto.language || 'en',
      serviceList: serviceList,
    });
    return result;
  }

  async suggestCampaignIdea(dto: SuggestCampaignIdeaDto): Promise<any> {
    const services = await this.getServiceService().findAllActiveServices();
    const settings = await this.getSettingService().getSettings();
    
    const serviceList = services.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');
    const knowledgeBase = settings?.knowledgeBase || '';
    
    const result = await this.getChatbotService().runFlow('suggestCampaignIdea', {
      knowledgeBase: knowledgeBase,
      language: dto.language || 'en',
      serviceList: serviceList,
    });
    return result;
  }
}
