
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "@/services/bootstrap";
import { IChatbotService } from "@/modules/chatbot/domain/services/chatbot.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { IAnalyticsService } from "@/modules/analytics/domain/services/analytics.service.interface";
import { IConversationHistoryService } from "../../domain/services/conversation-history.service.interface";

const getChatbotService = () => resolve<IChatbotService>(SERVICE_KEYS.ChatbotService);
const getAnalyticsService = () => resolve<IAnalyticsService>(SERVICE_KEYS.AnalyticsService);
const getConversationHistoryService = () => resolve<IConversationHistoryService>(SERVICE_KEYS.ConversationHistoryService);

async function handleRequest(req: NextRequest) {
  try {
    const body = await req.json();
    const { flowName, prompt, history, sessionId } = body;
    const senderId = sessionId || 'web-user';
    const channel = 'web';

    if (!flowName) {
      return NextResponse.json(
        { message: "Missing flowName" },
        { status: 400 }
      );
    }
    
    const conversationHistoryService = getConversationHistoryService();
    const userHistory = await conversationHistoryService.getHistory(senderId);

    // Pass the entire body to the service, as different flows have different inputs
    const result = await getChatbotService().runFlow(flowName, { ...body, history: userHistory });

    // After getting the response, trigger analytics for web chat
    if (flowName === 'chatbotAnswerQuestions' && prompt) {
        const analyticsService = getAnalyticsService();

        // Update conversation history
        await conversationHistoryService.updateHistory(senderId, prompt, result.answer);

        // Run analytics processing in the background (fire and forget)
        analyticsService.classifyAndSave(prompt, senderId, channel).catch(console.error);
        
        if (result.toolCalls && result.toolCalls.length > 0) {
            for (const toolCall of result.toolCalls) {
                analyticsService.logToolCall({
                    senderId,
                    channel,
                    toolName: toolCall.name,
                    input: toolCall.input,
                    wasSuccessful: toolCall.output.success,
                    outputMessage: toolCall.output.message,
                }).catch(console.error);
            }
        }
    }


    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { message: "An error occurred in the chatbot service.", error: error.message },
      { status: 500 }
    );
  }
}

async function getHistoryHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');

    if (!senderId) {
      return NextResponse.json({ message: "senderId is required" }, { status: 400 });
    }

    const history = await getConversationHistoryService().getHistory(senderId);
    return NextResponse.json(history);

  } catch (error: any) {
    console.error("Chatbot History API Error:", error);
    return NextResponse.json({ message: "An error occurred fetching chat history.", error: error.message }, { status: 500 });
  }
}

export const chatbotController = {
  handleRequest,
  getHistoryHandler,
};
