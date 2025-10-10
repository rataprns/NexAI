
import { Location } from '../entities/location.entity';
import { LocationDto, UpdateLocationDto } from '../../application/dtos/location.dto';

export interface ILocationService {
  createLocation(dto: LocationDto): Promise<Location>;
  updateLocation(dto: UpdateLocationDto): Promise<Location | null>;
  deleteLocation(id: string): Promise<void>;
  findLocationById(id: string): Promise<Location | null>;
  findAllLocations(): Promise<Location[]>;
  findAllActiveLocations(): Promise<Location[]>;
}
