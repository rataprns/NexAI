
'use server';

import { getAi, getDynamicModel } from '@/ai/genkit';
import { z } from 'genkit';

let prompt: any;
let suggestCampaignIdeaFlow: any;

async function initializeFlow() {
    if (suggestCampaignIdeaFlow) return;

    const ai = await getAi();

    const SuggestCampaignIdeaInputSchema = z.object({
      knowledgeBase: z.string().describe('The general knowledge base of the business.'),
      serviceList: z.string().describe('A list of available services.'),
      language: z.string().describe('The language for the generated content (e.g., "en", "es").'),
    });

    const SuggestCampaignIdeaOutputSchema = z.object({
      name: z.string().describe('A short, catchy name for the marketing campaign.'),
      slug: z.string().describe('A URL-friendly slug for the campaign (e.g., "summer-special").'),
      description: z.string().describe('A detailed and compelling description of the campaign, its target audience, and its goal.'),
    });

    prompt = ai.definePrompt({
      name: 'suggestCampaignIdeaPrompt',
      input: { schema: SuggestCampaignIdeaInputSchema },
      output: { schema: SuggestCampaignIdeaOutputSchema },
      prompt: `You are a creative marketing strategist. Your task is to invent a new, compelling marketing campaign idea based on a company's existing knowledge base and list of services.

CRITICAL INSTRUCTIONS:
1.  **Generate all content in the specified language**: {{{language}}}.
2.  **Analyze the Inputs:** Review the knowledge base and the list of services to understand what the business does and what it offers.
3.  **Invent a Campaign:** Come up with a creative angle for a promotion. It could be seasonal (like a "Summer Special"), target a specific audience (like "Back to School for Students"), or highlight a particular service.
4.  **Generate a Name:** Create a short, memorable name for the campaign. (e.g., "Spring Renewal Package," "Exclusive VIP Offer").
5.  **Generate a Slug:** Create a simple, URL-friendly slug for the campaign. It must be lowercase, contain only letters, numbers, and hyphens.
6.  **Generate a Description:** Write a detailed description for the campaign. This description will be used by another AI to generate the landing page content. It should clearly explain the campaign's goal, the target audience, the main offer or discount, and the desired tone (e.g., "energetic and motivating," "calm and reassuring"). Be specific. For example, instead of just "a discount", say "a 20% discount on the 'Nutritional Evaluation' service".

---
KNOWLEDGE BASE:
{{{knowledgeBase}}}
---
AVAILABLE SERVICES:
{{{serviceList}}}
---
`,
    });

    suggestCampaignIdeaFlow = ai.defineFlow(
      {
        name: 'suggestCampaignIdeaFlow',
        inputSchema: SuggestCampaignIdeaInputSchema,
        outputSchema: SuggestCampaignIdeaOutputSchema,
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

export async function suggestCampaignIdea(input: z.infer<z.ZodType<any, any, any>>) {
  if (!suggestCampaignIdeaFlow) {
    await initializeFlow();
  }
  return suggestCampaignIdeaFlow(input);
}
