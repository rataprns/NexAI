
import { Service } from '../entities/service.entity';
import { ServiceDto, UpdateServiceDto } from '../../application/dtos/service.dto';

export interface IServiceRepository {
  create(dto: ServiceDto): Promise<Service>;
  update(dto: UpdateServiceDto): Promise<Service | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  findAllActive(): Promise<Service[]>;
}
