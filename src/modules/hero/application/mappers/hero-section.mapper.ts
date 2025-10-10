
import { HeroSection } from '../../domain/entities/hero-section.entity';
import { IHeroSection } from '../../infrastructure/persistence/mongoose/models/hero-section.model';

export class HeroSectionMapper {
  static toDomain(doc: IHeroSection): HeroSection {
    return new HeroSection(
      doc._id.toString(),
      doc.title,
      doc.subtitle,
      doc.ctaButton1Text,
      doc.ctaButton1Href,
      doc.ctaButton2Text,
      doc.ctaButton2Href,
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
