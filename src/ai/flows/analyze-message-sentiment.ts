
'use server';

/**
 * @fileOverview An AI flow to analyze the sentiment and tone of a user's message.
 * - analyzeMessageSentiment - A function that takes a user message and returns its sentiment analysis.
 */

import { getAi, getDynamicModel } from '@/ai/genkit';
import { z } from 'genkit';
import {
  MessageSentimentEnum,
  MessageUrgencyEnum,
  MessageInteractionTypeEnum,
} from '@/modules/analytics/domain/entities/message-sentiment.entity';

const AnalyzeSentimentInputSchema = z.object({
  prompt: z.string().describe("The user's message to analyze."),
});

const AnalyzeSentimentOutputSchema = z.object({
  sentiment: MessageSentimentEnum.describe('The overall sentiment of the user message.'),
  urgency: MessageUrgencyEnum.describe('The level of urgency detected in the message.'),
  interactionType: MessageInteractionTypeEnum.describe('The type of interaction, identifying exceptionally positive or negative experiences.'),
});

let analyzePrompt: any;
let analyzeFlow: any;

async function initializeFlow() {
  if (analyzeFlow) return;

  const ai = await getAi();
  
  analyzePrompt = ai.definePrompt({
    name: 'analyzeMessageSentimentPrompt',
    input: { schema: AnalyzeSentimentInputSchema },
    output: { schema: AnalyzeSentimentOutputSchema },
    prompt: `You are an expert in sentiment analysis and customer experience. Analyze the user's message based on its content, tone, and language.

    1.  **Sentiment**: Classify the overall feeling of the message.
        - POSITIVE: The user seems happy, satisfied, or is giving a compliment.
        - NEGATIVE: The user seems upset, frustrated, angry, or is complaining.
        - NEUTRAL: The message is purely informational, a simple question, or does not convey strong emotion.

    2.  **Urgency**: Determine if the message requires immediate attention.
        - HIGH: The user uses words like "urgent," "help now," "immediately," is expressing extreme frustration, or is facing a critical issue.
        - MEDIUM: The user has a time-sensitive issue but it's not critical, e.g., needs to change an appointment for tomorrow.
        - LOW: It's a general question, a comment, or there's no time pressure.

    3.  **Interaction Type**: Identify if this is a standout moment.
        - MAGIC_MOMENT: The user is exceptionally happy, expressing deep gratitude, or praising the service enthusiastically. Example: "This is the best service I have ever used! Thank you so much!"
        - FRICTION_MOMENT: The user is extremely frustrated, threatening to leave, or mentioning a significant failure in the service. Example: "I've been trying to fix this for hours and I'm about to give up. This is ridiculous."
        - NEUTRAL: It's a standard interaction that is not exceptionally good or bad.

    User Message: "{{{prompt}}}"
    `,
  });
  
  analyzeFlow = ai.defineFlow(
    {
      name: 'analyzeMessageSentimentFlow',
      inputSchema: AnalyzeSentimentInputSchema,
      outputSchema: AnalyzeSentimentOutputSchema,
    },
    async (input) => {
      const model = await getDynamicModel();
      const { output } = await analyzePrompt(input, { model });
      return output!;
    }
  );
}

// Initialize the flow when the module is loaded
initializeFlow();

export async function analyzeMessageSentiment(
  input: z.infer<typeof AnalyzeSentimentInputSchema>
): Promise<z.infer<typeof AnalyzeSentimentOutputSchema>> {
  if (!analyzeFlow) {
    await initializeFlow();
  }
  return analyzeFlow(input);
}
