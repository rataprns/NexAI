
'use server';
/**
 * @fileOverview An AI flow to improve or rewrite a given piece of text.
 *
 * - improveText - A function that takes text and a prompt to generate a rewritten version.
 */

import { getAi, getDynamicModel } from '@/ai/genkit';
import { z } from 'genkit';

const ImproveTextInputSchema = z.object({
  text: z.string().describe('The text to be improved or rewritten.'),
  prompt: z
    .string()
    .describe(
      'An optional instruction for how to improve the text (e.g., "make it more professional", "translate to Spanish", "generate a paragraph about space"). If no prompt is provided, significantly improve the text.'
    ),
});

const ImproveTextOutputSchema = z.object({
  improvedText: z.string().describe('The rewritten text.'),
});

export async function improveText(
  input: z.infer<typeof ImproveTextInputSchema>
) {
  const ai = await getAi();

  const improveTextPrompt = ai.definePrompt({
    name: 'improveTextPrompt',
    input: { schema: ImproveTextInputSchema },
    output: { schema: ImproveTextOutputSchema },
    prompt: `You are an expert copy editor and content creator. Your task is to rewrite the given text based on a specific instruction.
  
  CRITICAL INSTRUCTIONS:
  1.  **If a custom instruction is provided**, you MUST prioritize it above all else. This instruction can be for anything: translation, summarization, changing the tone, correcting grammar, or even generating completely new content based on the instruction.
  2.  **If the instruction is generic like "Improve this text" or no instruction is provided at all**, you must perform a SUBSTANTIAL rewrite. Your goal is to make the text more clear, concise, engaging, and professional.
      -   DO NOT just fix typos.
      -   Rephrase sentences for better flow and impact.
      -   Use stronger vocabulary.
      -   Under no circumstances should you return the original text. You MUST provide a significantly improved version.
  3.  Only return the final, rewritten text in the 'improvedText' field. Do not include any of your own commentary, introductions, or apologies.
  
  Instruction: "{{{prompt}}}"
  ---
  Text to process:
  "{{{text}}}"
  `,
  });
  
  const improveTextFlow = ai.defineFlow(
    {
      name: 'improveTextFlow',
      inputSchema: ImproveTextInputSchema,
      outputSchema: ImproveTextOutputSchema,
    },
    async (input) => {
      const model = await getDynamicModel();
      const { output } = await improveTextPrompt(input, { model });
      return output!;
    }
  );
  
  return improveTextFlow(input);
}
