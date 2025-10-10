
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import type { ISchedulingService } from '@/modules/scheduling/domain/services/scheduling.service.interface';
import type { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import { format, toZonedTime } from 'date-fns-tz';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { AppointmentStatus } from '@/lib/types';

const checkAppointmentInputSchema = z.object({
  name: z.string().describe("The full name of the client."),
  secretWord1: z.string().describe("The first secret word provided by the client."),
  secretWord2: z.string().describe("The second secret word provided by the client."),
});

const AppointmentDetailSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.nativeEnum(AppointmentStatus),
});

const checkAppointmentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  appointments: z.array(AppointmentDetailSchema).optional(),
});

async function checkAppointment(
  input: z.infer<typeof checkAppointmentInputSchema>,
  context: any
): Promise<z.infer<typeof checkAppointmentOutputSchema>> {
  const services = context.context.services as {
    schedulingService: ISchedulingService,
    clientService: IClientService,
    settingService: ISettingService,
  };

  const { schedulingService, clientService, settingService } = services;
  const { name, secretWord1, secretWord2 } = input;

  try {
    const settings = await settingService.getSettings();
    const timeZone = settings?.timezone || 'America/Santiago';
    
    const clients = await clientService.findClientByName(name);

    if (!clients || clients.length === 0) {
      return { success: false, message: "Sorry, I couldn't find a client with that name. Please check the spelling and try again." };
    }

    const client = clients.find(c => c.secretWord1 === secretWord1 && c.secretWord2 === secretWord2);

    if (!client) {
      return { success: false, message: "The secret words you provided are incorrect. Please try again." };
    }

    const allAppointments = await schedulingService.findByClientId(client.id);

    if (allAppointments.length === 0) {
      return { success: true, message: `Hello ${client.name}. You have no appointments scheduled.` };
    }

    const appointmentDetailsForTool = allAppointments.map(app => ({
      id: app.id,
      date: format(toZonedTime(new Date(app.date), timeZone), 'PPPP p', { timeZone }),
      status: app.status,
    }));
    
    const formattedMessage = allAppointments.map(app => {
        const zonedDate = toZonedTime(new Date(app.date), timeZone);
        return `- ${format(zonedDate, 'PPPP p', { timeZone })} (Status: ${app.status})`;
    }).join('\n');

    return { 
      success: true, 
      message: `Hello ${client.name}. I found your appointment(s):\n${formattedMessage}`,
      appointments: appointmentDetailsForTool
    };

  } catch (error: any) {
    console.error('Error in checkAppointment tool:', error);
    return {
      success: false,
      message: 'I encountered an error while checking your appointment. Please try again later.',
    };
  }
}

let tool: any;
export async function getCheckAppointmentTool() {
  if (tool) {
    return tool;
  }
  const ai = await getAi();
  tool = ai.defineTool(
    {
      name: 'checkAppointmentTool',
      description: 'Use this tool to check, view, or get details about a client\'s existing appointments. You must collect the client\'s full name and their two secret words for verification before using this tool. This tool returns the appointment ID, which is needed for other actions like rebooking.',
      inputSchema: checkAppointmentInputSchema,
      outputSchema: checkAppointmentOutputSchema,
    },
    checkAppointment
  );
  return tool;
}
