
'use server';

import { getAi } from '@/ai/genkit';
import { z } from 'zod';
import type { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import { ISecretWordService } from '@/modules/security/domain/services/secret-word.service.interface';

const updateSecretWordsInputSchema = z.object({
  name: z.string().describe("The client's full name for verification."),
  email: z.string().email().describe("The client's email address for verification."),
  oldSecretWord1: z.string().describe("The client's first OLD secret word."),
  oldSecretWord2: z.string().describe("The client's second OLD secret word."),
  newSecretWord1: z.string().describe("The client's first NEW secret word."),
  newSecretWord2: z.string().describe("The client's second NEW secret word."),
});

async function updateSecretWords(
  input: z.infer<typeof updateSecretWordsInputSchema>,
  context: any
): Promise<{ success: boolean; message: string }> {
  const services = context.context.services as {
    clientService: IClientService;
    secretWordService: ISecretWordService;
  };
  const { clientService, secretWordService } = services;
  const { name, email, oldSecretWord1, oldSecretWord2, newSecretWord1, newWord2 } = input;

  try {
    // 1. Verify Client
    const client = await clientService.findClientByEmail(email);
    if (!client || client.name.toLowerCase() !== name.toLowerCase()) {
      return { success: false, message: "I couldn't find an account matching that name and email. Please check the details and try again." };
    }
    
    if (client.secretWord1 !== oldSecretWord1 || client.secretWord2 !== oldSecretWord2) {
      return { success: false, message: "The old secret words you provided are incorrect. Please try again." };
    }

    if (newSecretWord1 === newWord2) {
      return { success: false, message: "Your two new secret words cannot be the same. Please choose two different words." };
    }

    // 2. Check if new words are available
    const availability = await secretWordService.areWordsAvailable(newSecretWord1, newWord2);
    if (!availability.available) {
      if (availability.existing.length > 1) {
          return { success: false, message: `I'm sorry, but the words "${availability.existing.join('" and "')}" are already in use. Please choose different words.` };
      }
      return { success: false, message: `I'm sorry, but the word "${availability.existing[0]}" is already in use. Please choose a different word.` };
    }

    // 3. Update the words
    await clientService.updateSecretWords(client.id, newSecretWord1, newWord2);
    
    // 4. Update the used words registry
    await secretWordService.generateUniqueWordPair(); // This will add the new pair
    // In a real scenario, we might want a more direct way to remove the old pair
    // but for now, we assume words can be reused by others once a client changes them.

    return { 
      success: true, 
      message: `Your secret words have been successfully updated. Please remember your new words: **${newSecretWord1}** and **${newWord2}**.`
    };

  } catch (error: any) {
    console.error('Error in updateSecretWords tool:', error);
    return {
      success: false,
      message: error.message || 'I encountered an unexpected error while updating your secret words. Please try again later.',
    };
  }
}

let tool: any;
export async function getUpdateSecretWordsTool() {
  if (tool) {
    return tool;
  }
  const ai = await getAi();
  tool = ai.defineTool(
    {
      name: 'updateSecretWordsTool',
      description: "Use this tool to update a client's secret words. First, you must collect the client's full name, email, and their two OLD secret words for verification. Then, you must ask for their two NEW secret words. Only call this tool once you have all six pieces of information.",
      inputSchema: updateSecretWordsInputSchema,
      outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    updateSecretWords
  );
  return tool;
}
