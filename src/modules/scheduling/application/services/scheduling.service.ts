
import { IAppointmentRepository } from '../../domain/repositories/appointment.repository';
import { ISchedulingService } from '../../domain/services/scheduling.service.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '@/lib/types';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';
import { IClientRepository } from '@/modules/clients/domain/repositories/client.repository';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { IEmailService } from '@/modules/email/domain/services/email.service.interface';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { format, toZonedTime } from 'date-fns-tz';
import { IEmailTemplateService } from '@/modules/email-templates/domain/services/email-template.service.interface';
import { EmailTemplateType } from '@/modules/email-templates/domain/entities/email-template.entity';
import { es, enUS } from 'date-fns/locale';
import { getCurrentLocale } from '@/locales/server';
import { ILocationService } from '@/modules/locations/domain/services/location.service.interface';
import { IServiceService } from '@/modules/services/domain/services/service.service.interface';

export class SchedulingService implements ISchedulingService {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  private getClientRepository(): IClientRepository {
    return resolve<IClientRepository>(SERVICE_KEYS.ClientRepository);
  }

  private getEmailService(): IEmailService {
    return resolve<IEmailService>(SERVICE_KEYS.EmailService);
  }

  private getSettingService(): ISettingService {
    return resolve<ISettingService>(SERVICE_KEYS.SettingService);
  }

   private getLocationService(): ILocationService {
    return resolve<ILocationService>(SERVICE_KEYS.LocationService);
  }
   private getServiceService(): IServiceService {
    return resolve<IServiceService>(SERVICE_KEYS.ServiceService);
  }

  private getEmailTemplateService(): IEmailTemplateService {
    return resolve<IEmailTemplateService>(SERVICE_KEYS.EmailTemplateService);
  }

  async createAppointment(dto: { date: Date; clientId: string; locationId: string; name: string; email: string; serviceId?: string }): Promise<Appointment> {
    const newAppointment = await this.appointmentRepository.create(dto);
    
    try {
        await this.sendAppointmentEmail(EmailTemplateType.APPOINTMENT_CONFIRMATION, newAppointment);
    } catch (emailError) {
        console.error("Failed to send appointment confirmation email:", emailError);
    }
    
    return newAppointment;
  }

  async findAppointmentById(appointmentId: string): Promise<Appointment | null> {
    return this.appointmentRepository.findById(appointmentId);
  }

  async findByClientId(clientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByClientId(clientId);
  }

  async findAllAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.findAll();
  }

  async findAppointmentsByDate(date: Date, locationId?: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByDate(date, locationId);
  }

  async findExactAppointment(clientId: string, date: Date): Promise<Appointment | null> {
    return this.appointmentRepository.findByClientIdAndDate(clientId, date);
  }

  async rebookAppointment(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    if (appointment.clientId !== userId) {
        throw new Error('User not authorized to rebook this appointment');
    }
    if (appointment.status !== AppointmentStatus.Cancelled) {
      throw new Error('Only cancelled appointments can be rebooked.');
    }
    appointment.status = AppointmentStatus.Scheduled;
    const rebookedAppointment = await this.appointmentRepository.save(appointment);

    try {
      await this.sendAppointmentEmail(EmailTemplateType.APPOINTMENT_CONFIRMATION, rebookedAppointment);
    } catch (emailError) {
      console.error("Failed to send appointment rebooking confirmation email:", emailError);
    }

    return rebookedAppointment;
  }

  async cancelAppointment(appointmentId: string, userId: string, userRole: UserRole): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    if (userRole !== UserRole.ADMIN) {
       const clientRepo = this.getClientRepository();
       const userAsClient = await clientRepo.findById(userId);
       const isOwner = userAsClient ? appointment.clientId === userAsClient.id : false;

       if(!isOwner) {
         throw new Error('User not authorized to cancel this appointment');
       }
    }
    
    if (appointment.status === AppointmentStatus.Completed || appointment.status === AppointmentStatus.Cancelled) {
        throw new Error('Appointment cannot be cancelled');
    }

    appointment.status = AppointmentStatus.Cancelled;
    const cancelledAppointment = await this.appointmentRepository.save(appointment);

    try {
        await this.sendAppointmentEmail(EmailTemplateType.APPOINTMENT_CANCELLATION, cancelledAppointment);
    } catch (emailError) {
        console.error("Failed to send appointment cancellation email:", emailError);
    }

    return cancelledAppointment;
  }
  
  async updateAppointment(appointmentId: string, newDate: Date, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);

    if (!appointment) {
      throw new Error('Appointment not found');
    }
    if (appointment.clientId !== userId) {
        throw new Error('User not authorized to update this appointment');
    }
    if (appointment.status !== AppointmentStatus.Scheduled) {
        throw new Error('Only active appointments can be updated.');
    }

    const existingAppointmentsOnNewDate = await this.findAppointmentsByDate(newDate, appointment.locationId);
    if (existingAppointmentsOnNewDate.some(app => app.id !== appointmentId)) {
        throw new Error('The new time slot is no longer available.');
    }

    appointment.date = newDate;
    
    const updatedAppointment = await this.appointmentRepository.update(appointment);

    try {
        await this.sendAppointmentEmail(EmailTemplateType.APPOINTMENT_CONFIRMATION, updatedAppointment);
    } catch (emailError) {
        console.error("Failed to send appointment update confirmation email:", emailError);
    }

    return updatedAppointment;
  }

  private async sendAppointmentEmail(templateType: EmailTemplateType, appointment: Appointment): Promise<void> {
    if (!appointment.email || !appointment.name) {
      console.warn("Cannot send email, appointment is missing name or email.");
      return;
    }
    
    const settings = await this.getSettingService().getSettings();
    const location = await this.getLocationService().findLocationById(appointment.locationId);
    const service = appointment.serviceId ? await this.getServiceService().findServiceById(appointment.serviceId) : null;
    const timeZone = settings?.timezone || 'America/Santiago';
    const appName = settings?.appName || 'Our Company';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    
    const locale = await getCurrentLocale();
    const dateFnsLocale = locale === 'es' ? es : enUS;

    const template = await this.getEmailTemplateService().getTemplate(templateType);
    
    if (template) {
        const zonedDate = toZonedTime(appointment.date, timeZone);
        const formattedDate = format(zonedDate, 'PPP', { timeZone, locale: dateFnsLocale });
        const formattedTime = format(zonedDate, 'p', { timeZone, locale: dateFnsLocale });

        const utcDate = new Date(appointment.date);
        const utcEndDate = new Date(utcDate.getTime() + (service?.duration || 30) * 60 * 1000); 
        const formatForGoogle = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
        
        const googleCalendarLink = new URL('https://calendar.google.com/calendar/render');
        googleCalendarLink.searchParams.append('action', 'TEMPLATE');
        googleCalendarLink.searchParams.append('text', `Cita para ${service?.name || 'servicio'} en ${location?.name || appName}`);
        googleCalendarLink.searchParams.append('dates', `${formatForGoogle(utcDate)}/${formatForGoogle(utcEndDate)}`);
        googleCalendarLink.searchParams.append('details', `Cita para ${appointment.name} para el servicio de ${service?.name} en ${location?.name}`);
        googleCalendarLink.searchParams.append('location', location?.address || `Oficinas de ${appName}`);

        const icsLink = `${baseUrl}/api/scheduling/ics/${appointment.id}`;

        let subject = template.subject.replace('{appName}', appName);
        let body = template.body
            .replace(/{name}/g, appointment.name)
            .replace(/{date}/g, formattedDate)
            .replace(/{time}/g, formattedTime)
            .replace(/{appName}/g, appName)
            .replace(/{serviceName}/g, service?.name || 'nuestro servicio')
            .replace(/{locationName}/g, location?.name || '')
            .replace(/{locationAddress}/g, location?.address || '')
            .replace(/{googleCalendarLink}/g, googleCalendarLink.toString())
            .replace(/{icsLink}/g, icsLink);

        await this.getEmailService().sendMail({
            to: appointment.email,
            subject: subject,
            html: body
        });
    }
  }
}
