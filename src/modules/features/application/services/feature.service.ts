
import { IFeatureRepository } from '../../domain/repositories/feature.repository';
import { IFeatureService } from '../../domain/services/feature.service.interface';
import { UpdateFeaturesDto } from '../dtos/feature.dto';
import { FeaturesSection } from '../../domain/entities/feature.entity';

export class FeatureService implements IFeatureService {
  constructor(private readonly featureRepository: IFeatureRepository) {}

  async getFeatures(): Promise<FeaturesSection | null> {
    return this.featureRepository.getFeatures();
  }

  async updateFeatures(dto: UpdateFeaturesDto): Promise<FeaturesSection> {
    return this.featureRepository.updateFeatures(dto);
  }
}
