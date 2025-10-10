
import { ServicesSection } from '../../domain/entities/services-section.entity';
import { IServicesSection } from '../../infrastructure/persistence/mongoose/models/services-section.model';

export class ServicesSectionMapper {
  static toDomain(doc: IServicesSection): ServicesSection {
    return new ServicesSection(
      doc._id.toString(),
      doc.badge,
      doc.title,
      doc.subtitle,
      doc.createdAt,
      doc.updatedAt,
      doc.containerStyles,
      doc.gridStyles,
      doc.titleColor,
      doc.subtitleColor
    );
  }
}
