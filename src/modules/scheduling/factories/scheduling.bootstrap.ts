
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createAppointmentRepository } from './scheduling-repository.factory';
import { createSchedulingService } from './scheduling-service.factory';

export function bootstrapSchedulingModule(): void {
  container.register(SERVICE_KEYS.AppointmentRepository, createAppointmentRepository);
  container.register(SERVICE_KEYS.SchedulingService, createSchedulingService);
}
