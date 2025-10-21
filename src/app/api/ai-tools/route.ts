
import { NextRequest, NextResponse } from "next/server";
import { resolve } from "@/services/bootstrap";
import { IChatbotService } from "@/modules/chatbot/domain/services/chatbot.service.interface";
import { SERVICE_KEYS } from "@/config/service-keys-const";

const getChatbotService = () => resolve<IChatbotService>(SERVICE_KEYS.ChatbotService);

/**
 * This endpoint is exclusively for internal AI tools (e.g., text improver)
 * and does NOT handle customer chat sessions, lead creation, or analytics.
 */
async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { flowName } = body;

    if (!flowName) {
      return NextResponse.json(
        { message: "Missing flowName" },
        { status: 400 }
      );
    }
    
    // Pass the entire body to the service, as different flows have different inputs.
    // No lead creation, history, or analytics logic is needed here.
    const result = await getChatbotService().runFlow(flowName, body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Tools API Error:", error);
    return NextResponse.json(
      { message: "An error occurred in the AI tools service.", error: error.message },
      { status: 500 }
    );
  }
}

export const POST = handler;
