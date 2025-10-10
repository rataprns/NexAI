
import { FooterSection, FooterLinkColumn, FooterLink } from '../../domain/entities/footer-section.entity';
import { IFooterSection } from '../../infrastructure/persistence/mongoose/models/footer-section.model';

export class FooterSectionMapper {
  static toDomain(doc: IFooterSection): FooterSection {
    return new FooterSection(
      doc._id.toString(),
      doc.description,
      doc.linkColumns.map(col => new FooterLinkColumn(
        col.title,
        col.links.map(link => new FooterLink(link.text, link.href))
      )),
      doc.createdAt,
      doc.updatedAt
    );
  }
}
