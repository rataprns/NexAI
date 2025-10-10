
'use server';

/**
 * @fileOverview An AI flow to classify the user's intent from a message.
 * - classifyMessageIntent - A function that takes a user message and returns its primary intent.
 */

import { getAi, getDynamicModel } from '@/ai/genkit';
import { z } from 'genkit';
import { MessageIntentEnum } from '@/modules/analytics/domain/entities/message-intent.entity';

const ClassifyIntentInputSchema = z.object({
  prompt: z.string().describe('The user\'s message to classify.'),
});

const ClassifyIntentOutputSchema = z.object({
  intent: MessageIntentEnum.describe('The single most likely intent of the user message.'),
});

let classifyPrompt: any;
let classifyFlow: any;

async function initializeFlow() {
  if (classifyFlow) return;

  const ai = await getAi();
  
  classifyPrompt = ai.definePrompt({
    name: 'classifyMessageIntentPrompt',
    input: { schema: ClassifyIntentInputSchema },
    output: { schema: ClassifyIntentOutputSchema },
    prompt: `You are an expert at classifying user messages into predefined categories. Analyze the user message and determine its primary intent.

    You must classify the message into one of the following categories:
    - APPOINTMENT_BOOKING: For requests to schedule, book, or create a new appointment or consultation. Examples: "I want to book an appointment," "Can I schedule a meeting?", "I need a new reservation."
    - APPOINTMENT_MANAGEMENT: For requests to check, view, get details, cancel, change, move, or reschedule an existing appointment. Examples: "I want to see my appointments," "check my bookings," "cancel my appointment for tomorrow," "I need to change my time."
    - SERVICE_INQUIRY: For questions about the company's services, products, pricing, or business hours. Examples: "How much does it cost?", "What services do you offer?", "Are you open on Sundays?"
    - GREETING_INQUIRY: For simple greetings, introductions, or initial messages that don't yet specify a clear intent. Examples: "Hello," "Hi," "Good morning," "I have a question."
    - COMPLAINT_ISSUE: For messages expressing dissatisfaction, problems, or complaints with a service. Examples: "This is not working," "I'm very unhappy with the service," "I want to file a complaint."
    - OFF_TOPIC: For any message that is not related to the business, including spam, random chatter, or conversations that are clearly irrelevant.
    - OTHER: Use this only if the message is business-related but does not fit any other category.

    User Message: "{{{prompt}}}"
    `,
  });
  
  classifyFlow = ai.defineFlow(
    {
      name: 'classifyMessageIntentFlow',
      inputSchema: ClassifyIntentInputSchema,
      outputSchema: ClassifyIntentOutputSchema,
    },
    async (input) => {
      const model = await getDynamicModel();
      const { output } = await classifyPrompt(input, { model });
      return output!;
    }
  );
}

// Initialize the flow when the module is loaded
initializeFlow();

export async function classifyMessageIntent(
  input: z.infer<typeof ClassifyIntentInputSchema>
): Promise<z.infer<typeof ClassifyIntentOutputSchema>> {
  if (!classifyFlow) {
    await initializeFlow();
  }
  return classifyFlow(input);
}
