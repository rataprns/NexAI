
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';
import { Appointment } from '../entities/appointment.entity';

export interface ISchedulingService {
  createAppointment(dto: { date: Date; clientId: string; locationId: string; name: string; email: string; serviceId?: string; }): Promise<Appointment>;
  findAppointmentById(appointmentId: string): Promise<Appointment | null>;
  findByClientId(clientId: string): Promise<Appointment[]>;
  findAllAppointments(): Promise<Appointment[]>;
  findAppointmentsByDate(date: Date, locationId?: string): Promise<Appointment[]>;
  findExactAppointment(clientId: string, date: Date): Promise<Appointment | null>;
  cancelAppointment(appointmentId: string, userId: string, userRole: UserRole): Promise<Appointment>;
  updateAppointment(appointmentId: string, newDate: Date, userId: string): Promise<Appointment>;
  rebookAppointment(appointmentId: string, userId: string): Promise<Appointment>;
}
