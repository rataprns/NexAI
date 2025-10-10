
import { IServicesSectionRepository } from '../../domain/repositories/services-section.repository';
import { IServicesSectionService } from '../../domain/services/services-section.service.interface';
import { UpdateServicesSectionDto } from '../dtos/services-section.dto';
import { ServicesSection } from '../../domain/entities/services-section.entity';

export class ServicesSectionService implements IServicesSectionService {
  constructor(private readonly repository: IServicesSectionRepository) {}

  async getServicesSection(): Promise<ServicesSection | null> {
    return this.repository.getServicesSection();
  }

  async updateServicesSection(dto: UpdateServicesSectionDto): Promise<ServicesSection> {
    return this.repository.updateServicesSection(dto);
  }
}
