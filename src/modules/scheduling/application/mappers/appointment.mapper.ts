
import { Appointment } from '../../domain/entities/appointment.entity';
import { IAppointment } from '../../infrastructure/persistence/mongoose/models/appointment.model';
import { LocationMapper } from '@/modules/locations/application/mappers/location.mapper';

export class AppointmentMapper {
  static toDomain(doc: IAppointment & { createdAt?: Date, updatedAt?: Date }): Appointment {
    const location = doc.populate && doc.populated('locationId') ? LocationMapper.toDomain(doc.populated('locationId')) : undefined;
    return new Appointment(
      doc._id.toString(),
      doc.clientId.toString(),
      doc.locationId.toString(),
      doc.date,
      doc.status,
      doc.createdAt || new Date(),
      doc.updatedAt || new Date(),
      doc.name,
      doc.email,
      location,
      doc.serviceId?.toString()
    );
  }
}
