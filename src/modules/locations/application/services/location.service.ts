
import { ILocationRepository } from '../../domain/repositories/location.repository';
import { ILocationService } from '../../domain/services/location.service.interface';
import { Location } from '../../domain/entities/location.entity';
import { LocationDto, UpdateLocationDto } from '../dtos/location.dto';

export class LocationService implements ILocationService {
  constructor(private readonly repository: ILocationRepository) {}

  async createLocation(dto: LocationDto): Promise<Location> {
    return this.repository.create(dto);
  }

  async updateLocation(dto: UpdateLocationDto): Promise<Location | null> {
    return this.repository.update(dto);
  }

  async deleteLocation(id: string): Promise<void> {
    return this.repository.delete(id);
  }
  
  async findLocationById(id: string): Promise<Location | null> {
    return this.repository.findById(id);
  }

  async findAllLocations(): Promise<Location[]> {
    return this.repository.findAll();
  }

  async findAllActiveLocations(): Promise<Location[]> {
    return this.repository.findAllActive();
  }
}
