
import { TestimonialsSection, TestimonialItem } from '../../domain/entities/testimonial.entity';
import { ITestimonialsSection } from '../../infrastructure/persistence/mongoose/models/testimonial.model';

export class TestimonialMapper {
  static toDomain(doc: ITestimonialsSection): TestimonialsSection {
    return new TestimonialsSection(
      doc._id.toString(),
      doc.badge,
      doc.title,
      doc.subtitle,
      doc.items.map(item => new TestimonialItem(item.quote, item.name, item.title, item.avatar)),
      doc.containerStyles,
      doc.gridStyles,
      doc.titleColor,
      doc.subtitleColor,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
