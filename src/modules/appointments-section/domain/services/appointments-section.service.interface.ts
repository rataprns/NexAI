
import { AppointmentsSection } from '../entities/appointments-section.entity';
import { UpdateAppointmentsSectionDto } from '../../application/dtos/appointments-section.dto';

export interface IAppointmentsSectionService {
  getAppointmentsSection(): Promise<AppointmentsSection | null>;
  updateAppointmentsSection(dto: UpdateAppointmentsSectionDto): Promise<AppointmentsSection>;
}
