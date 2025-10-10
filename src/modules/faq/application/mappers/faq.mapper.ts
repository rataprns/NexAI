
import { FaqSection, FaqItem } from '../../domain/entities/faq.entity';
import { IFaqSection } from '../../infrastructure/persistence/mongoose/models/faq.model';

export class FaqMapper {
  static toDomain(doc: IFaqSection): FaqSection {
    return new FaqSection(
      doc._id.toString(),
      doc.badge,
      doc.title,
      doc.subtitle,
      doc.items.map(item => new FaqItem(item.question, item.answer)),
      doc.createdAt,
      doc.updatedAt,
      doc.containerStyles,
      doc.gridStyles,
      doc.titleColor,
      doc.subtitleColor
    );
  }
}
