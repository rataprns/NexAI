
import { ServicesSection } from '../entities/services-section.entity';
import { UpdateServicesSectionDto } from '../../application/dtos/services-section.dto';

export interface IServicesSectionRepository {
  getServicesSection(): Promise<ServicesSection | null>;
  updateServicesSection(dto: UpdateServicesSectionDto): Promise<ServicesSection>;
}
