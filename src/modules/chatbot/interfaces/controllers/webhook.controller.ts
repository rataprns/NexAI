
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "@/services/bootstrap";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ISettingService } from "@/modules/settings/domain/services/setting.service.interface";
import { IChatbotService } from "@/modules/chatbot/domain/services/chatbot.service.interface";
import { IWhatsappService } from "@/modules/integrations/domain/services/whatsapp.service.interface";
import { IMessengerService } from "@/modules/integrations/domain/services/messenger.service.interface";
import { IInstagramService } from "@/modules/integrations/domain/services/instagram.service.interface";
import { IConversationHistoryService } from "@/modules/chatbot/domain/services/conversation-history.service.interface";
import { IAnalyticsService } from "@/modules/analytics/domain/services/analytics.service.interface";
import * as crypto from 'crypto';

const getSettingService = () => resolve<ISettingService>(SERVICE_KEYS.SettingService);
const getChatbotService = () => resolve<IChatbotService>(SERVICE_KEYS.ChatbotService);
const getWhatsappService = () => resolve<IWhatsappService>(SERVICE_KEYS.WhatsappService);
const getMessengerService = () => resolve<IMessengerService>(SERVICE_KEYS.MessengerService);
const getInstagramService = () => resolve<IInstagramService>(SERVICE_KEYS.InstagramService);
const getConversationHistoryService = () => resolve<IConversationHistoryService>(SERVICE_KEYS.ConversationHistoryService);
const getAnalyticsService = () => resolve<IAnalyticsService>(SERVICE_KEYS.AnalyticsService);


async function handler(req: NextRequest, { params }: { params: { channel: string } }) {
    const { channel } = params;

    if (req.method === 'GET') {
        return handleVerification(req, channel);
    } else if (req.method === 'POST') {
        return handleMessage(req, channel);
    } else {
        return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    }
}

async function handleVerification(req: NextRequest, channel: string) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const settings = await getSettingService().getSettings();
    const verifyToken = settings?.integrations?.[channel as keyof typeof settings.integrations]?.webhookVerifyToken;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log(`Webhook verified for channel: ${channel}`);
        return new NextResponse(challenge, { status: 200 });
    } else {
        console.error(`Webhook verification failed for channel: ${channel}`);
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
}

async function handleMessage(req: NextRequest, channel: string) {
    const settings = await getSettingService().getSettings();
    const channelConfig = settings?.integrations?.[channel as keyof typeof settings.integrations];

    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256') || '';

    if (channelConfig?.appSecret) {
        const hmac = crypto.createHmac('sha256', channelConfig.appSecret);
        hmac.update(rawBody);
        const expectedSignature = `sha256=${hmac.digest('hex')}`;

        if (signature !== expectedSignature) {
            console.error(`Invalid webhook signature for channel: ${channel}`);
            return NextResponse.json({ message: 'Forbidden: Invalid signature' }, { status: 403 });
        }
    }

    const body = JSON.parse(rawBody);
    
    if (body.object === 'page' || body.object === 'whatsapp_business_account' || body.object === 'instagram') {
        for (const entry of body.entry) {
            const webhookEvent = entry.messaging?.[0] || entry.changes?.[0]?.value?.messages?.[0];
            
            if (webhookEvent && webhookEvent.message && !webhookEvent.message.is_echo) { // Ignore echos
                let senderId;
                let messageText;

                if ((channel === 'messenger' || channel === 'instagram') && webhookEvent.message) {
                    senderId = webhookEvent.sender.id;
                    messageText = webhookEvent.message.text;
                } else if (channel === 'whatsapp' && webhookEvent.text) {
                    senderId = webhookEvent.from;
                    messageText = webhookEvent.text.body;
                }

                if (senderId && messageText) {
                    const conversationHistoryService = getConversationHistoryService();
                    const analyticsService = getAnalyticsService();

                    const userHistory = await conversationHistoryService.getHistory(senderId);
                    
                    const chatResponse = await getChatbotService().runFlow('chatbotAnswerQuestions', {
                        prompt: messageText,
                        history: userHistory,
                    });
                    
                    // Run analytics processing after getting the bot's response
                    await analyticsService.classifyAndSave(messageText, senderId, channel);
                    
                    if (chatResponse.toolCalls && chatResponse.toolCalls.length > 0) {
                        for (const toolCall of chatResponse.toolCalls) {
                            await analyticsService.logToolCall({
                                senderId,
                                channel,
                                toolName: toolCall.name,
                                input: toolCall.input,
                                wasSuccessful: toolCall.output.success,
                                outputMessage: toolCall.output.message,
                            });
                        }
                    }

                    await conversationHistoryService.updateHistory(senderId, messageText, chatResponse.answer);

                    if (channel === 'messenger') {
                        await getMessengerService().sendMessage(senderId, chatResponse.answer);
                    } else if (channel === 'whatsapp') {
                        await getWhatsappService().sendMessage(senderId, chatResponse.answer);
                    } else if (channel === 'instagram') {
                        await getInstagramService().sendMessage(senderId, chatResponse.answer);
                    }
                }
            }
        }
    }
    
    return NextResponse.json({ status: 'ok' }, { status: 200 });
}

export const webhookController = {
    handler
};
