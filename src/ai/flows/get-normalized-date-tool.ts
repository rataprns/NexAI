
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import * as chrono from 'chrono-node';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { format } from 'date-fns';

const getNormalizedDateInputSchema = z.object({
  dateText: z.string().describe("A natural language date expression, like 'today', 'tomorrow', 'next Friday', or 'in 2 days'."),
  language: z.string().describe("The language of the date expression (e.g., 'en', 'es').")
});

const getNormalizedDateOutputSchema = z.object({
  success: z.boolean().describe("Whether the date normalization was successful."),
  message: z.string().describe("A message describing the result."),
  normalizedDate: z.string().describe("The resulting date in 'YYYY-MM-DD' format."),
});

async function getNormalizedDate(
  input: z.infer<typeof getNormalizedDateInputSchema>,
  context: any
): Promise<z.infer<typeof getNormalizedDateOutputSchema>> {
  const services = context.context.services as {
    settingService: ISettingService,
  };
  
  const { settingService } = services;
  const settings = await settingService.getSettings();
  const timeZone = settings?.timezone || 'America/Santiago';

  // Create a 'now' date based on the business's timezone
  const now = new Date(new Date().toLocaleString('en-US', { timeZone }));

  const parser = input.language === 'es' ? chrono.es : chrono;
  // Provide 'now' as the reference date for chrono to work from
  const parsedDate = parser.parseDate(input.dateText, now, { forwardDate: true });
  
  if (!parsedDate) {
    throw new Error(`I couldn't understand the date "${input.dateText}". Please try a different format.`);
  }

  const normalizedDate = format(parsedDate, 'yyyy-MM-dd');

  return { 
    success: true,
    message: `Date normalized to ${normalizedDate}`,
    normalizedDate 
  };
}

let tool: any;
export async function getNormalizedDateTool() {
  if (tool) {
    return tool;
  }
  const ai = await getAi();
  tool = ai.defineTool(
    {
      name: 'getNormalizedDateTool',
      description: 'Use this tool to convert a relative or natural language date (like "today" or "next Monday") into a standard YYYY-MM-DD format. This should be used before any tool that requires a specific date.',
      inputSchema: getNormalizedDateInputSchema,
      outputSchema: getNormalizedDateOutputSchema,
    },
    getNormalizedDate
  );
  return tool;
}
