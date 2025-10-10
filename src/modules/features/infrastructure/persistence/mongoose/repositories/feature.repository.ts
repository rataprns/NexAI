
import dbConnect from '@/lib/db';
import { IFeatureRepository } from '@/modules/features/domain/repositories/feature.repository';
import { FeaturesSection } from '@/modules/features/domain/entities/feature.entity';
import { FeaturesSectionModel } from '../models/feature.model';
import { FeatureMapper } from '@/modules/features/application/mappers/feature.mapper';
import { UpdateFeaturesDto } from '@/modules/features/application/dtos/feature.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseFeatureRepository implements IFeatureRepository {

  public async getFeatures(): Promise<FeaturesSection | null> {
    await dbConnect();
    let features = await FeaturesSectionModel.findOne();
    if (!features) {
      features = await FeaturesSectionModel.create(defaultSettings.landingPage.features);
    }
    return FeatureMapper.toDomain(features);
  }

  public async updateFeatures(dto: UpdateFeaturesDto): Promise<FeaturesSection> {
    await dbConnect();
    const updatedFeatures = await FeaturesSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedFeatures) {
        throw new Error('Failed to update or create features section settings.');
    }
    return FeatureMapper.toDomain(updatedFeatures);
  }
}
