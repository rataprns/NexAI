
import { ContactSection } from '../../domain/entities/contact-section.entity';
import { IContactSection } from '../../infrastructure/persistence/mongoose/models/contact-section.model';

export class ContactSectionMapper {
  static toDomain(doc: IContactSection): ContactSection {
    return new ContactSection(
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
