
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import type { ISchedulingService } from '@/modules/scheduling/domain/services/scheduling.service.interface';
import type { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import type { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { fromZonedTime } from 'date-fns-tz';

const updateAppointmentInputSchema = z.object({
  name: z.string().describe("The full name of the client."),
  secretWord1: z.string().describe("The first secret word provided by the client."),
  secretWord2: z.string().describe("The second secret word provided by the client."),
  oldDate: z.string().describe("The original date of the appointment to update in 'YYYY-MM-DD' format."),
  oldTime: z.string().describe("The original time of the appointment to update in 'HH:mm' (24-hour) format."),
  newDate: z.string().describe("The new date for the appointment in 'YYYY-MM-DD' format."),
  newTime: z.string().describe("The new time for the appointment in 'HH:mm' (24-hour) format."),
});

async function updateAppointment(
  input: z.infer<typeof updateAppointmentInputSchema>,
  context: any
): Promise<{ success: boolean; message: string }> {
  const services = context.context.services as {
    schedulingService: ISchedulingService,
    clientService: IClientService,
    settingService: ISettingService,
  };

  const { schedulingService, clientService, settingService } = services;
  const { name, secretWord1, secretWord2, oldDate, oldTime, newDate, newTime } = input;

  try {
    const clients = await clientService.findClientByName(name);
    if (!clients || clients.length === 0) {
      return { success: false, message: "Sorry, I couldn't find a client with that name. Please check the spelling and try again." };
    }
    
    const client = clients.find(c => c.secretWord1 === secretWord1 && c.secretWord2 === secretWord2);
    if (!client) {
      return { success: false, message: "The secret words you provided are incorrect. Please try again." };
    }
    
    const settings = await settingService.getSettings();
    const timeZone = settings?.timezone || 'America/Santiago';
    
    const oldDateTimeString = `${oldDate}T${oldTime}:00`;
    const oldZonedDate = fromZonedTime(oldDateTimeString, timeZone);

    const appointmentToUpdate = await schedulingService.findExactAppointment(client.id, oldZonedDate);

    if (!appointmentToUpdate) {
      return { success: false, message: `I couldn't find an appointment for you on ${oldDate} at ${oldTime}. Please check the details.` };
    }

    const newDateTimeString = `${newDate}T${newTime}:00`;
    const newZonedDate = fromZonedTime(newDateTimeString, timeZone);

    await schedulingService.updateAppointment(appointmentToUpdate.id, newZonedDate, client.id);

    return { 
      success: true, 
      message: `Your appointment has been successfully updated to ${newDate} at ${newTime}.` 
    };

  } catch (error: any) {
    console.error('Error in updateAppointment tool:', error);
    return {
      success: false,
      message: error.message || 'I encountered an error while trying to update your appointment. Please try again later.',
    };
  }
}

let tool: any;
export async function getUpdateAppointmentTool() {
  if (tool) {
    return tool;
  }
  const ai = await getAi();
  tool = ai.defineTool(
    {
      name: 'updateAppointmentTool',
      description: 'Use this tool to change the date or time of a client\'s existing, active appointment to a new date/time. You must collect the client\'s name, their two secret words, the original date and time of the appointment, and the new desired date and time before using this tool.',
      inputSchema: updateAppointmentInputSchema,
      outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    updateAppointment
  );
  return tool;
}
