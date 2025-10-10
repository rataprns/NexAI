

import { NextRequest, NextResponse } from 'next/server';
import { createAppointmentSchema, createPublicAppointmentSchema } from '@/modules/scheduling/application/dtos/appointment.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { ISchedulingService } from '@/modules/scheduling/domain/services/scheduling.service.interface';
import { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';

const getSchedulingService = () => resolve<ISchedulingService>(SERVICE_KEYS.SchedulingService);
const getClientService = () => resolve<IClientService>(SERVICE_KEYS.ClientService);
const getSettingService = () => resolve<ISettingService>(SERVICE_KEYS.SettingService);

async function createHandler(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    
    const handleBooking = async (validation: any) => {
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }

        const { email, name, date, time, locationId, serviceId } = validation.data;
        
        const settings = await getSettingService().getSettings();
        const timeZone = settings?.timezone || 'America/Santiago';
        
        const dateTimeString = `${date}T${time}`;
        
        const finalUtcDate = fromZonedTime(dateTimeString, timeZone);
        
        let client = await getClientService().findClientByEmail(email);
        if (!client) {
            client = await getClientService().createClient({ email, name });
        }

        const appointment = await getSchedulingService().createAppointment({
            date: finalUtcDate,
            clientId: client.id,
            name: name,
            email: email,
            locationId: locationId,
            serviceId: serviceId
        });
        
        const response = {
          appointment: appointment,
          client: client
        }

        return NextResponse.json(response, { status: 201 });
    };

    const schema = session?.userId ? createAppointmentSchema : createPublicAppointmentSchema;
    const validation = schema.safeParse(body);
    return handleBooking(validation);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

async function listHandler(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    let appointments;
    if (session.role === UserRole.ADMIN) {
      appointments = await getSchedulingService().findAllAppointments();
    } else {
      appointments = [];
    }
    
    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function cancelHandler(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Appointment ID is required' }, { status: 400 });
    }

    await getSchedulingService().cancelAppointment(id, session.userId, session.role);
    return NextResponse.json({ message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

async function rebookHandler(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await getSchedulingService().rebookAppointment(id, session.userId);
    return NextResponse.json(appointment, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

async function getAvailabilityHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get('date');
        const locationId = searchParams.get('locationId');

        if (!dateStr || !locationId) {
            return NextResponse.json({ message: 'Date and Location ID parameters are required' }, { status: 400 });
        }
        
        const settings = await getSettingService().getSettings();
        const timeZone = settings?.timezone || 'America/Santiago';
        
        const searchDate = fromZonedTime(`${dateStr}T00:00:00`, timeZone);

        const appointments = await getSchedulingService().findAppointmentsByDate(searchDate, locationId);
        
        const busySlots = appointments.map(app => {
            const zonedDate = toZonedTime(new Date(app.date), timeZone);
            return format(zonedDate, 'HH:mm', { timeZone });
        });

        return NextResponse.json(busySlots);

    } catch (error: any) {
        return NextResponse.json({ message: 'Failed to get availability' }, { status: 500 });
    }
}

async function getIcsHandler(req: NextRequest, { params }: { params: { appointmentId: string } }) {
  try {
    const { appointmentId } = params;
    
    if (!appointmentId) {
      return NextResponse.json({ message: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await getSchedulingService().findAppointmentById(appointmentId);
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    const settings = await getSettingService().getSettings();
    const appName = settings?.appName || 'Appointment';

    // Dates must be in UTC for the ICS file
    const startDate = new Date(appointment.date);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // Assuming 30-minute duration

    const formatICSDate = (date: Date) => {
        return format(date, "yyyyMMdd'T'HHmmss'Z'");
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:Cita con ${appName}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `DESCRIPTION:Cita para ${appointment.name} (${appointment.email})`,
      `LOCATION:Oficina de ${appName}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const headers = {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="appointment.ics"`
    };

    return new NextResponse(icsContent, { status: 200, headers });

  } catch (error: any) {
    console.error('[ICS_GENERATION_ERROR]', error);
    return NextResponse.json({ message: 'Failed to generate ICS file' }, { status: 500 });
  }
}

export const schedulingController = {
    createHandler,
    listHandler,
    cancelHandler,
    rebookHandler,
    getAvailabilityHandler,
    getIcsHandler,
}
