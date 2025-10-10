
'use server';
/**
 * @fileOverview An AI flow to generate new text based on a prompt.
 *
 * - generateText - A function that takes a prompt and generates new text.
 */

import { getAi, getDynamicModel } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTextInputSchema = z.object({
  prompt: z
    .string()
    .describe('The instruction for what text to generate (e.g., "write a paragraph about space exploration").'),
});

const GenerateTextOutputSchema = z.object({
  generatedText: z.string().describe('The generated text.'),
});

export async function generateText(
  input: z.infer<typeof GenerateTextInputSchema>
) {
  const ai = await getAi();
  
  const generateTextPrompt = ai.definePrompt({
    name: 'generateTextPrompt',
    input: { schema: GenerateTextInputSchema },
    output: { schema: GenerateTextOutputSchema },
    prompt: `You are a creative content writer. Generate text based on the following instruction.
  Only return the generated text, with no additional commentary.
  
  Instruction: {{{prompt}}}
  `,
  });
  
  const generateTextFlow = ai.defineFlow(
    {
      name: 'generateTextFlow',
      inputSchema: GenerateTextInputSchema,
      outputSchema: GenerateTextOutputSchema,
    },
    async (input) => {
      const model = await getDynamicModel();
      const { output } = await generateTextPrompt(input, { model });
      return output!;
    }
  );

  return generateTextFlow(input);
}
