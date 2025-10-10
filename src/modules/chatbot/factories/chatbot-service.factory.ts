
import { ChatbotService } from "../application/services/chatbot.service";
import { IChatbotService } from '../domain/services/chatbot.service.interface';

let _chatbotServiceInstance: IChatbotService;

export function createChatbotService(): IChatbotService {
    if(!_chatbotServiceInstance){
        _chatbotServiceInstance = new ChatbotService();
    }
    return _chatbotServiceInstance;
}
