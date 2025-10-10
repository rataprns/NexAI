
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import type { ISchedulingService } from '@/modules/scheduling/domain/services/scheduling.service.interface';
import type { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import { fromZonedTime } from 'date-fns-tz';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';

const cancelAppointmentInputSchema = z.object({
  name: z.string().describe("The full name of the client."),
  secretWord1: z.string().describe("The first secret word provided by the client."),
  secretWord2: z.string().describe("The second secret word provided by the client."),
  date: z.string().describe("The date of the appointment to cancel in 'YYYY-MM-DD' format."),
  time: z.string().describe("The time of the appointment to cancel in 'HH:mm' (24-hour) format."),
});

async function cancelAppointment(
  input: z.infer<typeof cancelAppointmentInputSchema>,
  context: any
): Promise<{ success: boolean; message: string }> {
  const services = context.context.services as {
    schedulingService: ISchedulingService,
    clientService: IClientService,
    settingService: ISettingService,
  };

  const { schedulingService, clientService, settingService } = services;
  const { name, secretWord1, secretWord2, date, time } = input;

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
    const dateTimeString = `${date}T${time}:00`;
    const zonedDate = fromZonedTime(dateTimeString, timeZone);

    const appointmentToCancel = await schedulingService.findExactAppointment(client.id, zonedDate);

    if (!appointmentToCancel) {
      return { success: false, message: `I couldn't find an appointment for you on ${date} at ${time}. Please check the details.` };
    }

    await schedulingService.cancelAppointment(appointmentToCancel.id, client.id, UserRole.USER);

    return { 
      success: true, 
      message: `Your appointment on ${date} at ${time} has been successfully cancelled.` 
    };

  } catch (error: any) {
    console.error('Error in cancelAppointment tool:', error);
    return {
      success: false,
      message: 'I encountered an error while trying to cancel your appointment. Please try again later.',
    };
  }
}

let tool: any;
export async function getCancelAppointmentTool() {
  if (tool) {
    return tool;
  }
  const ai = await getAi();
  tool = ai.defineTool(
    {
      name: 'cancelAppointmentTool',
      description: 'Use this tool to cancel a client\'s existing appointment. You must first use the checkAppointmentTool to list their appointments. Then, you must collect the client\'s name, their two secret words, and the exact date and time of the appointment they wish to cancel from the list provided before using this tool.',
      inputSchema: cancelAppointmentInputSchema,
      outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    cancelAppointment
  );
  return tool;
}
