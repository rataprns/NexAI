
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import type { ISchedulingService } from '@/modules/scheduling/domain/services/scheduling.service.interface';
import type { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import type { ILocationService } from '@/modules/locations/domain/services/location.service.interface';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import { IServiceService } from '@/modules/services/domain/services/service.service.interface';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';

const scheduleAppointmentInputSchema = z.object({
  name: z.string().describe("The full name of the person to book the appointment for."),
  email: z.string().email().describe("The email address of the person."),
  date: z.string().describe("The date of the appointment in 'YYYY-MM-DD' format."),
  time: z.string().describe("The time of the appointment in 'HH:mm' (24-hour) format."),
  locationId: z.string().describe("The ID of the location for the appointment."),
  serviceId: z.string().describe("The ID of the service being booked."),
});

async function scheduleAppointment(
  input: z.infer<typeof scheduleAppointmentInputSchema>,
  context: any,
): Promise<{ success: boolean; message: string }> {
  if (!context || !context.context || !context.context.services) {
    throw new Error("Services not provided to the tool context.");
  }
  const services = context.context.services as {
      schedulingService: ISchedulingService,
      clientService: IClientService,
      locationService: ILocationService,
      serviceService: IServiceService,
      settingService: ISettingService,
  };

  const { schedulingService, clientService, locationService, serviceService, settingService } = services;
  const { name, email, date, time, locationId, serviceId } = input;
  
  const location = await locationService.findLocationById(locationId);
  if (!location) {
    return { success: false, message: "Sorry, the selected location is not valid. Please try again." };
  }

  const service = await serviceService.findServiceById(serviceId);
  if (!service) {
      return { success: false, message: "Sorry, that service is not valid." };
  }
  if (!service.locationIds.includes(locationId)) {
      return { success: false, message: `Sorry, the '${service.name}' service is not available at the ${location.name} location.` };
  }

  const settings = await settingService.getSettings();
  const timeZone = settings?.timezone || 'America/Santiago';
  const availability = location.availability;

  try {
    const dateTimeString = `${date}T${time}`;
    const zonedDate = fromZonedTime(dateTimeString, timeZone);
    const now = toZonedTime(new Date(), timeZone);

    if (zonedDate < now) {
      return { success: false, message: `You cannot book an appointment in the past. Please choose a future date and time.` };
    }
    
    const dayOfWeek = zonedDate.getDay();
    if (!availability?.availableDays?.includes(dayOfWeek)) {
      return { success: false, message: `Sorry, ${location.name} is not open on that day. Please choose a different day of the week.` };
    }

    const dateString = format(zonedDate, 'yyyy-MM-dd');
    if (availability?.disabledDates?.map(d => format(new Date(d), 'yyyy-MM-dd')).includes(dateString)) {
        return { success: false, message: `Sorry, ${location.name} is closed on ${date}. Please select another date.` };
    }

    const appointmentsOnDate = await schedulingService.findAppointmentsByDate(zonedDate, locationId);
    const requestedTime = format(toZonedTime(zonedDate, timeZone), 'HH:mm', { timeZone });
    const isSlotTaken = appointmentsOnDate.some(app => {
        const appTime = format(toZonedTime(app.date, timeZone), 'HH:mm', { timeZone });
        return appTime === requestedTime;
    });

    if (isSlotTaken) {
        return { success: false, message: `Sorry, the time slot ${time} on ${date} at ${location.name} is already booked. Please choose another time.` };
    }

    let client = await clientService.findClientByEmail(email);
    if (!client) {
      client = await clientService.createClient({ name, email });
    }

    if (!client || !client.secretWord1 || !client.secretWord2) {
      throw new Error("Failed to create or retrieve client with secret words.");
    }

    await schedulingService.createAppointment({
      date: zonedDate,
      clientId: client.id,
      name: client.name,
      email: client.email,
      locationId: locationId,
      serviceId: serviceId,
    });

    return {
      success: true,
      message: `Appointment for ${service.name} successfully scheduled for ${name} at ${location.name} on ${date} at ${time}. IMPORTANT: Please save your secret words to manage your appointment later. Your secret words are: **${client.secretWord1}** and **${client.secretWord2}**.`,
    };
  } catch (error: any) {
    console.error('Error in scheduleAppointment tool:', error);
    return {
      success: false,
      message: 'I was unable to schedule the appointment. Please try again or book through the website.',
    };
  }
}

let tool: any;

export async function getScheduleAppointmentTool() {
    if (tool) {
        return tool;
    }
    const ai = await getAi();
    tool = ai.defineTool(
      {
        name: 'scheduleAppointmentTool',
        description: 'Use this tool to schedule, book, or reserve a new appointment or consultation for a user. You must collect the user\'s name, email, desired date, desired time, location ID, and service ID before using this tool.',
        inputSchema: scheduleAppointmentInputSchema,
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
      },
      scheduleAppointment
    );
    return tool;
}
