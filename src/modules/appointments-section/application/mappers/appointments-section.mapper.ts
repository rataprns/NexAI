
import { AppointmentsSection } from '../../domain/entities/appointments-section.entity';
import { IAppointmentsSection } from '../../infrastructure/persistence/mongoose/models/appointments-section.model';

export class AppointmentsSectionMapper {
  static toDomain(doc: IAppointmentsSection): AppointmentsSection {
    return new AppointmentsSection(
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
