
import dbConnect from '@/lib/db';
import { IServiceRepository } from '@/modules/services/domain/repositories/service.repository';
import { Service } from '@/modules/services/domain/entities/service.entity';
import { ServiceModel } from '../models/service.model';
import { ServiceMapper } from '@/modules/services/application/mappers/service.mapper';
import { ServiceDto, UpdateServiceDto } from '@/modules/services/application/dtos/service.dto';
import { LocationModel } from '@/modules/locations/infrastructure/persistence/mongoose/models/location.model';
import mongoose from 'mongoose';

export class MongooseServiceRepository implements IServiceRepository {

  public async create(dto: ServiceDto): Promise<Service> {
    await dbConnect();
    const newService = new ServiceModel(dto);
    const savedService = await newService.save();

    if (dto.locationIds) {
      await LocationModel.updateMany(
        { _id: { $in: dto.locationIds } },
        { $addToSet: { serviceIds: savedService._id } }
      );
    }
    
    return ServiceMapper.toDomain(savedService);
  }

  public async update(dto: UpdateServiceDto): Promise<Service | null> {
    await dbConnect();
    const { id, locationIds, ...updateData } = dto;

    const originalService = await ServiceModel.findById(id);
    if (!originalService) return null;

    const originalLocationIds = originalService.locationIds.map(id => id.toString());
    const newLocationIds = locationIds || [];

    const locationsToAdd = newLocationIds.filter(locId => !originalLocationIds.includes(locId));
    const locationsToRemove = originalLocationIds.filter(locId => !newLocationIds.includes(locId));

    const updatedService = await ServiceModel.findByIdAndUpdate(id, { ...updateData, locationIds: newLocationIds.map(id => new mongoose.Types.ObjectId(id)) }, { new: true });
    
    if (locationsToAdd.length > 0) {
      await LocationModel.updateMany(
        { _id: { $in: locationsToAdd } },
        { $addToSet: { serviceIds: id } }
      );
    }
    
    if (locationsToRemove.length > 0) {
      await LocationModel.updateMany(
        { _id: { $in: locationsToRemove } },
        { $pull: { serviceIds: id } }
      );
    }
    
    return updatedService ? ServiceMapper.toDomain(updatedService) : null;
  }

  public async delete(id: string): Promise<void> {
    await dbConnect();
    await LocationModel.updateMany(
      { serviceIds: id },
      { $pull: { serviceIds: id } }
    );
    await ServiceModel.findByIdAndDelete(id);
  }

  public async findById(id: string): Promise<Service | null> {
    await dbConnect();
    const service = await ServiceModel.findById(id);
    return service ? ServiceMapper.toDomain(service) : null;
  }

  public async findAll(): Promise<Service[]> {
    await dbConnect();
    const services = await ServiceModel.find().sort({ name: 1 });
    return services.map(ServiceMapper.toDomain);
  }

  public async findAllActive(): Promise<Service[]> {
    await dbConnect();
    const services = await ServiceModel.find({ isActive: true }).sort({ name: 1 });
    return services.map(ServiceMapper.toDomain);
  }
}
