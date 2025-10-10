
import { IServiceRepository } from '../../domain/repositories/service.repository';
import { IServiceService } from '../../domain/services/service.service.interface';
import { Service } from '../../domain/entities/service.entity';
import { ServiceDto, UpdateServiceDto } from '../dtos/service.dto';

export class ServiceService implements IServiceService {
  constructor(private readonly repository: IServiceRepository) {}

  async createService(dto: ServiceDto): Promise<Service> {
    return this.repository.create(dto);
  }

  async updateService(dto: UpdateServiceDto): Promise<Service | null> {
    return this.repository.update(dto);
  }

  async deleteService(id: string): Promise<void> {
    return this.repository.delete(id);
  }
  
  async findServiceById(id: string): Promise<Service | null> {
    return this.repository.findById(id);
  }

  async findAllServices(): Promise<Service[]> {
    return this.repository.findAll();
  }

  async findAllActiveServices(): Promise<Service[]> {
    return this.repository.findAllActive();
  }
}
