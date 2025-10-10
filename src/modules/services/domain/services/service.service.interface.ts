
import { Service } from '../entities/service.entity';
import { ServiceDto, UpdateServiceDto } from '../../application/dtos/service.dto';

export interface IServiceService {
  createService(dto: ServiceDto): Promise<Service>;
  updateService(dto: UpdateServiceDto): Promise<Service | null>;
  deleteService(id: string): Promise<void>;
  findServiceById(id: string): Promise<Service | null>;
  findAllServices(): Promise<Service[]>;
  findAllActiveServices(): Promise<Service[]>;
}
