
import { Appointment } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  create(dto: { date: Date; clientId: string; locationId: string; name: string; email: string; serviceId?: string; }): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByClientId(clientId: string): Promise<Appointment[]>;
  findByClientIdAndDate(clientId: string, date: Date): Promise<Appointment | null>;
  findAll(): Promise<Appointment[]>;
  findByDate(date: Date, locationId?: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
}
