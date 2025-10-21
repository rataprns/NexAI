
'use server';

import { config } from 'dotenv';
config();

// Bootstrap all application modules and dependencies
import { initializeServices } from '@/services/bootstrap';
initializeServices();

// Import existing AI flows to register them with Genkit dev server
import '@/ai/flows/chatbot-answer-questions';
import '@/ai/flows/help-me-choose-best-product';
import '@/ai/flows/improve-text';
import '@/ai/flows/generate-text';
import '@/ai/flows/schedule-appointment-tool';
import '@/ai/flows/check-appointment-tool';
import '@/ai/flows/cancel-appointment-tool';
import '@/ai/flows/update-appointment-tool';
import '@/ai/flows/check-availability-tool';
import '@/ai-flows/rebook-appointment-tool';
import '@/ai/flows/get-normalized-date-tool';
import '@/ai/flows/classify-message-intent';
import '@/ai/flows/analyze-message-sentiment';
import '@/ai/flows/generate-campaign-content';
import '@/ai/flows/suggest-campaign-idea';
import '@/ai/flows/update-secret-words-tool';
