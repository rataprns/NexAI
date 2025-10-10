
'use server';

/**
 * @fileOverview An AI agent that helps users choose the best product based on their needs.
 *
 * - helpMeChooseBestProduct - A function that handles the product recommendation process.
 */

import { getAi, getDynamicModel } from '@/ai/genkit';
import {z} from 'genkit';

const HelpMeChooseBestProductInputSchema = z.object({
  userNeeds: z
    .string()
    .describe('The user description of needs for product recommendation.'),
  availableProducts: z
    .string()
    .describe('The description of available products or services.'),
});

const HelpMeChooseBestProductOutputSchema = z.object({
  recommendedProduct: z
    .string()
    .describe('The recommended product or service based on user needs.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});

export async function helpMeChooseBestProduct(
  input: z.infer<typeof HelpMeChooseBestProductInputSchema>
) {
  const ai = await getAi();
  
  const prompt = ai.definePrompt({
    name: 'helpMeChooseBestProductPrompt',
    input: {schema: HelpMeChooseBestProductInputSchema},
    output: {schema: HelpMeChooseBestProductOutputSchema},
    prompt: `You are an AI assistant specializing in product recommendations. A user will describe their needs and you need to suggest the most appropriate product from the list of available products.
  
  User needs: {{{userNeeds}}}
  Available Products: {{{availableProducts}}}
  
  Based on the information above, recommend one product or service that best fits the user's needs. Explain your reasoning for the recommendation.
  `,
  });
  
  const helpMeChooseBestProductFlow = ai.defineFlow(
    {
      name: 'helpMeChooseBestProductFlow',
      inputSchema: HelpMeChooseBestProductInputSchema,
      outputSchema: HelpMeChooseBestProductOutputSchema,
    },
    async input => {
      const model = await getDynamicModel();
      const {output} = await prompt(input, { model });
      return output!;
    }
  );

  return helpMeChooseBestProductFlow(input);
}
