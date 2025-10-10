
import { IAppointmentsSectionRepository } from '../../domain/repositories/appointments-section.repository';
import { IAppointmentsSectionService } from '../../domain/services/appointments-section.service.interface';
import { UpdateAppointmentsSectionDto } from '../dtos/appointments-section.dto';
import { AppointmentsSection } from '../../domain/entities/appointments-section.entity';

export class AppointmentsSectionService implements IAppointmentsSectionService {
  constructor(private readonly repository: IAppointmentsSectionRepository) {}

  async getAppointmentsSection(): Promise<AppointmentsSection | null> {
    return this.repository.getAppointmentsSection();
  }

  async updateAppointmentsSection(dto: UpdateAppointmentsSectionDto): Promise<AppointmentsSection> {
    return this.repository.updateAppointmentsSection(dto);
  }
}
