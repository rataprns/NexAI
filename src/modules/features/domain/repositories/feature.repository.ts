
import { FeaturesSection } from '../entities/feature.entity';
import { UpdateFeaturesDto } from '../../application/dtos/feature.dto';

export interface IFeatureRepository {
  getFeatures(): Promise<FeaturesSection | null>;
  updateFeatures(dto: UpdateFeaturesDto): Promise<FeaturesSection>;
}
