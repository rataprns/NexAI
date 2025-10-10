
import dbConnect from '@/lib/db';
import { ILocationRepository } from '@/modules/locations/domain/repositories/location.repository';
import { Location } from '@/modules/locations/domain/entities/location.entity';
import { LocationModel } from '../models/location.model';
import { LocationMapper } from '@/modules/locations/application/mappers/location.mapper';
import { LocationDto, UpdateLocationDto } from '@/modules/locations/application/dtos/location.dto';
import { ServiceModel } from '@/modules/services/infrastructure/persistence/mongoose/models/service.model';
import mongoose from 'mongoose';

export class MongooseLocationRepository implements ILocationRepository {

  public async create(dto: LocationDto): Promise<Location> {
    await dbConnect();
    const newLocation = new LocationModel(dto);
    const savedLocation = await newLocation.save();

    if (dto.serviceIds && dto.serviceIds.length > 0) {
      await ServiceModel.updateMany(
        { _id: { $in: dto.serviceIds } },
        { $addToSet: { locationIds: savedLocation._id } }
      );
    }

    return LocationMapper.toDomain(savedLocation);
  }

  public async update(dto: UpdateLocationDto): Promise<Location | null> {
    await dbConnect();
    const { id, serviceIds, ...updateData } = dto;

    const originalLocation = await LocationModel.findById(id);
    if (!originalLocation) return null;

    const originalServiceIds = originalLocation.serviceIds.map(id => id.toString());
    const newServiceIds = serviceIds || [];

    const servicesToAdd = newServiceIds.filter(svcId => !originalServiceIds.includes(svcId));
    const servicesToRemove = originalServiceIds.filter(svcId => !newServiceIds.includes(svcId));

    const updatedLocation = await LocationModel.findByIdAndUpdate(id, { ...updateData, serviceIds: newServiceIds.map(id => new mongoose.Types.ObjectId(id)) }, { new: true });
    
    if (servicesToAdd.length > 0) {
      await ServiceModel.updateMany(
        { _id: { $in: servicesToAdd } },
        { $addToSet: { locationIds: id } }
      );
    }
    
    if (servicesToRemove.length > 0) {
      await ServiceModel.updateMany(
        { _id: { $in: servicesToRemove } },
        { $pull: { locationIds: id } }
      );
    }
    
    return updatedLocation ? LocationMapper.toDomain(updatedLocation) : null;
  }

  public async delete(id: string): Promise<void> {
    await dbConnect();
    await ServiceModel.updateMany(
        { locationIds: id },
        { $pull: { locationIds: id } }
    );
    await LocationModel.findByIdAndDelete(id);
  }

  public async findById(id: string): Promise<Location | null> {
    await dbConnect();
    const location = await LocationModel.findById(id);
    return location ? LocationMapper.toDomain(location) : null;
  }

  public async findAll(): Promise<Location[]> {
    await dbConnect();
    const locations = await LocationModel.find().sort({ name: 1 });
    return locations.map(LocationMapper.toDomain);
  }

  public async findAllActive(): Promise<Location[]> {
    await dbConnect();
    const locations = await LocationModel.find({ isActive: true }).sort({ name: 1 });
    return locations.map(LocationMapper.toDomain);
  }
}
