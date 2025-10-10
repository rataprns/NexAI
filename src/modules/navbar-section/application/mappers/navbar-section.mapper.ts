
import { NavbarSection, NavbarLink } from '../../domain/entities/navbar-section.entity';
import { INavbarSection } from '../../infrastructure/persistence/mongoose/models/navbar-section.model';

export class NavbarSectionMapper {
  static toDomain(doc: INavbarSection): NavbarSection {
    return new NavbarSection(
      doc._id.toString(),
      doc.links.map(link => new NavbarLink(link.text, link.href, link.visible)),
      doc.createdAt,
      doc.updatedAt,
      doc.containerStyles,
      doc.navStyles
    );
  }
}
