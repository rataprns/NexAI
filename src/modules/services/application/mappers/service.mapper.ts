
import { Service, CustomField } from '../../domain/entities/service.entity';
import { IService } from '../../infrastructure/persistence/mongoose/models/service.model';

export class ServiceMapper {
  static toDomain(doc: IService): Service {
    return new Service(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.isActive,
      doc.duration,
      doc.price,
      doc.currency,
      (doc.customFields || []).map(cf => new CustomField(cf.label, cf.value)),
      (doc.locationIds || []).map(id => id.toString()),
      doc.createdAt,
      doc.updatedAt,
      doc.imageUrl,
      doc.offerPrice,
      doc.campaignId?.toString()
    );
  }
}
