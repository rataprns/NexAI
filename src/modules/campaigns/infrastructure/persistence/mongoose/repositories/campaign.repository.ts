
import dbConnect from '@/lib/db';
import { ICampaignRepository } from '@/modules/campaigns/domain/repositories/campaign.repository';
import { Campaign } from '@/modules/campaigns/domain/entities/campaign.entity';
import { CampaignModel } from '../models/campaign.model';
import { CampaignMapper } from '@/modules/campaigns/application/mappers/campaign.mapper';
import { CreateCampaignDto, UpdateCampaignDto } from '@/modules/campaigns/application/dtos/campaign.dto';
import mongoose from 'mongoose';

export class MongooseCampaignRepository implements ICampaignRepository {

  public async create(dto: CreateCampaignDto): Promise<Campaign> {
    await dbConnect();
    const existing = await CampaignModel.findOne({ slug: dto.slug });
    if (existing) {
      throw new Error(`A campaign with the slug "${dto.slug}" already exists.`);
    }
    const newCampaign = new CampaignModel(dto);
    const savedCampaign = await newCampaign.save();
    return CampaignMapper.toDomain(savedCampaign);
  }

  public async update(dto: UpdateCampaignDto): Promise<Campaign | null> {
    await dbConnect();
    const updatedCampaign = await CampaignModel.findByIdAndUpdate(dto.id, dto, { new: true });
    return updatedCampaign ? CampaignMapper.toDomain(updatedCampaign) : null;
  }

  public async delete(id: string): Promise<void> {
    await dbConnect();
    await CampaignModel.findByIdAndDelete(id);
  }

  public async findById(id: string): Promise<Campaign | null> {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const campaign = await CampaignModel.findById(id);
    return campaign ? CampaignMapper.toDomain(campaign) : null;
  }

  public async findBySlug(slug: string): Promise<Campaign | null> {
    await dbConnect();
    const campaign = await CampaignModel.findOne({ slug });
    return campaign ? CampaignMapper.toDomain(campaign) : null;
  }

  public async findAll(): Promise<Campaign[]> {
    await dbConnect();
    const campaigns = await CampaignModel.find().sort({ createdAt: 'desc' });
    return campaigns.map(CampaignMapper.toDomain);
  }
}
