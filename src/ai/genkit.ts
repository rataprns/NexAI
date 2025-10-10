
'use server';
/**
 * @fileOverview This file dynamically initializes and a singleton Genkit AI instance.
 *
 * It provides a getAi() function that configures Genkit based on settings
 * stored in the database, allowing for dynamic selection of AI models and plugins.
 */
import { genkit, GenkitBeta } from 'genkit/beta';
import { Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import type { GenkitPlugin, GenkitPluginV2 } from 'genkit/plugin';
import { SettingService } from '@/modules/settings/application/services/setting.service';
import { MongooseSettingRepository } from '@/modules/settings/infrastructure/persistence/mongoose/repositories/setting.repository';


let aiInstance: GenkitBeta | null = null;
let currentConfig: { plugin?: string, model?: string } = {};

const getSettingService = () => {
    // Instantiate directly to avoid circular dependency with bootstrap/resolve
    const repo = new MongooseSettingRepository();
    return new SettingService(repo);
};

/**
 * Dynamically retrieves the AI model from the saved configuration.
 * Falls back to default values if no configuration is set.
 * @returns The AI model instance.
 */
export async function getDynamicModel(modelName?: string): Promise<any> {
    const settings = await getSettingService().getSettings();
    const pluginName = settings?.plugin || 'googleai';
    const finalModelName = modelName || settings?.model || 'gemini-1.5-flash';

    switch (pluginName) {
        // Add other cases for 'openai', 'xai', etc. as you add support for them
        case 'googleai':
        default:
            return googleAI.model(finalModelName as any);
    }
}

function configurePlugins(pluginName: string): (GenkitPlugin | GenkitPluginV2)[]{
    const basePlugins: (GenkitPlugin | GenkitPluginV2)[] = [];

    switch (pluginName) {
        // case 'openai':
        //     // Ensure you have OPENAI_API_KEY in your .env file
        //     return [...basePlugins, openai({ apiKey: process.env.OPENAI_API_KEY })];
        case 'googleai':
        default:
            return [...basePlugins, googleAI()];
    }
}

export async function getAi(): Promise<GenkitBeta> {
    const settings = await getSettingService().getSettings();
    const pluginName = settings?.plugin || 'googleai';
    const modelName = settings?.model || 'gemini-1.5-flash';

    // Check if configuration has changed
    const configChanged = pluginName !== currentConfig.plugin || 
                          modelName !== currentConfig.model;

    if (!aiInstance || configChanged) {
        currentConfig = { plugin: pluginName, model: modelName };

        const plugins = configurePlugins(pluginName);
        
        aiInstance = genkit({
            plugins: plugins,
        });
    }

    return aiInstance;
}
