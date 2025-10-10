
import { Location } from '../entities/location.entity';
import { LocationDto, UpdateLocationDto } from '../../application/dtos/location.dto';

export interface ILocationRepository {
  create(dto: LocationDto): Promise<Location>;
  update(dto: UpdateLocationDto): Promise<Location | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Location | null>;
  findAll(): Promise<Location[]>;
  findAllActive(): Promise<Location[]>;
}
