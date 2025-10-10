
import { FeaturesSection, FeatureItem } from '../../domain/entities/feature.entity';
import { IFeaturesSection } from '../../infrastructure/persistence/mongoose/models/feature.model';

export class FeatureMapper {
  static toDomain(doc: IFeaturesSection): FeaturesSection {
    return new FeaturesSection(
      doc._id.toString(),
      doc.badge,
      doc.title,
      doc.subtitle,
      doc.items.map(item => new FeatureItem(item.icon, item.title, item.description)),
      doc.imageUrl,
      doc.containerStyles,
      doc.gridStyles,
      doc.titleColor,
      doc.subtitleColor,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
