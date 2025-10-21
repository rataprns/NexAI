
'use server';

import { getAi, getDynamicModel } from '@/ai/genkit';
import { z } from 'genkit';

let prompt: any;
let generateCampaignContentFlow: any;

async function initializeFlow() {
    if (generateCampaignContentFlow) return;

    const ai = await getAi();

    const GenerateCampaignContentInputSchema = z.object({
      description: z.string().describe('The user\'s description of the marketing campaign, its audience, and its goal.'),
      serviceList: z.string().describe('A list of available services and their IDs.'),
      language: z.string().describe('The language for the generated content (e.g., "en", "es").'),
    });
    
    const GenerateCampaignContentOutputSchema = z.object({
      generatedTitle: z.string().describe('A catchy, engaging headline for the landing page.'),
      generatedSubtitle: z.string().describe('A compelling subtitle that expands on the headline.'),
      generatedBody: z.string().describe('A short paragraph (2-3 sentences) explaining the campaign offer and call to action.'),
      suggestedChatbotGreeting: z.string().describe('A proactive, contextual greeting for the chatbot on this specific campaign page.'),
      suggestedConversionGoal: z.string().describe('The ID of the single most relevant service to offer for conversion, extracted from the service list. If no specific service matches, return the string "contact".'),
    });

    prompt = ai.definePrompt({
      name: 'generateCampaignContentPrompt',
      input: { schema: GenerateCampaignContentInputSchema },
      output: { schema: GenerateCampaignContentOutputSchema },
      prompt: `You are an expert marketing copywriter and strategist. Your task is to generate all the necessary assets for a new marketing campaign landing page based on a user's description.

CRITICAL INSTRUCTIONS:
1.  **Generate all content in the specified language**: {{{language}}}.
2.  **Analyze the User's Goal:** Read the user's description carefully to understand the target audience, the offer, and the desired tone.
3.  **Generate Landing Page Content:**
    *   **Title:** Create a powerful, short, and benefit-oriented headline.
    *   **Subtitle:** Write a sentence that clarifies or expands on the headline, highlighting the main benefit.
    *   **Body:** Write a concise paragraph (2-3 sentences max) that explains the offer, creates a sense of urgency or value, and encourages the user to act.
4.  **Generate Chatbot Behavior:**
    *   **Greeting:** Write a friendly, contextual opening message for the chatbot that acknowledges the user's interest in this specific campaign. It should be proactive and inviting.
    *   **Conversion Goal:** Analyze the user's description and the provided service list. Identify the SINGLE most relevant service ID from the list that matches the campaign's offer.
        *   If a clear service match is found (e.g., user mentions "evaluation" and there's a "Nutritional Evaluation" service), return ONLY its ID.
        *   If the goal is more general (e.g., "get more info", "talk to sales") or no service directly matches, return the string "contact".
        *   Do not return more than one ID. Do not invent an ID.

---
AVAILABLE SERVICES:
{{{serviceList}}}
---
USER CAMPAIGN DESCRIPTION:
"{{{description}}}"
`,
    });

    generateCampaignContentFlow = ai.defineFlow(
      {
        name: 'generateCampaignContentFlow',
        inputSchema: GenerateCampaignContentInputSchema,
        outputSchema: GenerateCampaignContentOutputSchema,
      },
      async (input) => {
        const model = await getDynamicModel();
        const { output } = await prompt(input, { model });
        return output!;
      }
    );
}

// Initialize the flow when the module is loaded
initializeFlow();

export async function generateCampaignContent(input: z.infer<z.ZodType<any, any, any>>) {
  if (!generateCampaignContentFlow) {
    await initializeFlow();
  }
  return generateCampaignContentFlow(input);
}
