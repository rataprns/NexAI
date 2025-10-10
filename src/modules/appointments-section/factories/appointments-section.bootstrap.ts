
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createAppointmentsSectionRepository } from './appointments-section-repository.factory';
import { createAppointmentsSectionService } from './appointments-section-service.factory';

export function bootstrapAppointmentsSectionModule(): void {
  container.register(SERVICE_KEYS.AppointmentsSectionRepository, createAppointmentsSectionRepository);
  container.register(SERVICE_KEYS.AppointmentsSectionService, createAppointmentsSectionService);
}
