
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import type { ISchedulingService } from '@/modules/scheduling/domain/services/scheduling.service.interface';
import { ILocationService } from '@/modules/locations/domain/services/location.service.interface';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import { getDay, parseISO } from 'date-fns';
import { AppointmentStatus } from '@/lib/types';

const checkAvailabilityInputSchema = z.object({
  date: z.string().describe("The date to check for availability in 'YYYY-MM-DD' format."),
  locationId: z.string().describe("The ID of the location to check availability for."),
  relativeDateText: z.string().optional().describe("The original relative date text from the user, like 'today' or 'tomorrow'."),
});

async function checkAvailability(
  input: z.infer<typeof checkAvailabilityInputSchema>,
  context: any
): Promise<{ success: boolean; message: string }> {
  const services = context.context.services as {
    schedulingService: ISchedulingService,
    locationService: ILocationService,
    settingService: ISettingService,
  };

  const { schedulingService, locationService, settingService } = services;
  const { date, locationId } = input;

  try {
    const location = await locationService.findLocationById(locationId);
    if (!location) {
        return { success: false, message: "Sorry, I couldn't find that location." };
    }
    
    const settings = await settingService.getSettings();
    const timeZone = settings?.timezone || 'America/Santiago';
    const availability = location.availability;
    const allPossibleTimes = availability?.availableTimes || [];
    
    if (allPossibleTimes.length === 0) {
        return { success: false, message: "Sorry, there are no available time slots configured for this location." };
    }

    const searchDate = fromZonedTime(`${date}T00:00:00`, timeZone);
    const dayOfWeek = getDay(searchDate);

    if (!availability?.availableDays?.includes(dayOfWeek)) {
        return { success: true, message: `Sorry, we are closed on that day at the ${location.name} location. Please choose a different day of the week.` };
    }
    
    const dateString = format(searchDate, 'yyyy-MM-dd');
    const disabledDatesAsStrings = availability?.disabledDates?.map(d => format(parseISO(d as unknown as string), 'yyyy-MM-dd')) || [];
    if (disabledDatesAsStrings.includes(dateString)) {
        return { success: true, message: `Sorry, we are closed on ${date} at the ${location.name} location. Please select another date.` };
    }

    const appointmentsOnDate = await schedulingService.findAppointmentsByDate(searchDate, locationId);
    
    const busySlots = appointmentsOnDate
        .filter(app => app.status === AppointmentStatus.Scheduled)
        .map(app => format(toZonedTime(app.date, timeZone), 'HH:mm'));
    
    const availableSlots = allPossibleTimes.filter(time => !busySlots.includes(time));
    const friendlyDate = input.relativeDateText ? `${input.relativeDateText} (${date})` : date;

    if (availableSlots.length === 0) {
      return { success: true, message: `There are no available time slots for ${friendlyDate} at the ${location.name} location. Please try another day.` };
    }

    return { 
      success: true, 
      message: `At the ${location.name} location, the available time slots for ${friendlyDate} are: ${availableSlots.join(', ')}. Would you like to book an appointment for any of these times? 😊` 
    };

  } catch (error: any) {
    console.error('Error in checkAvailability tool:', error);
    return {
      success: false,
      message: 'I encountered an error while checking for available times. Please try again later.',
    };
  }
}

let tool: any;
export async function getCheckAvailabilityTool() {
  if (tool) {
    return tool;
  }
  const ai = await getAi();
  tool = ai.defineTool(
    {
      name: 'checkAvailabilityTool',
      description: 'Use this tool to check for available appointment time slots on a specific date for a given location. You must collect the desired date and the location ID from the user before using this tool.',
      inputSchema: checkAvailabilityInputSchema,
      outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    checkAvailability
  );
  return tool;
}
