
import { Location } from '../../domain/entities/location.entity';
import { ILocation } from '../../infrastructure/persistence/mongoose/models/location.model';

export class LocationMapper {
  static toDomain(doc: ILocation): Location {
    const availability = doc.availability || { availableDays: [], availableTimes: [], disabledDates: [] };
    return new Location(
      doc._id.toString(),
      doc.name,
      doc.isActive,
      {
        availableDays: availability.availableDays,
        availableTimes: availability.availableTimes,
        disabledDates: availability.disabledDates,
      },
      (doc.serviceIds || []).map(id => id.toString()),
      doc.createdAt,
      doc.updatedAt,
      doc.address,
      doc.phone,
    );
  }
}
