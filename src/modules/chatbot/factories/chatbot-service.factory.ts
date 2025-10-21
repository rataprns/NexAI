
import { runFlow } from "../application/services/chatbot.service";
import { IChatbotService } from '../domain/services/chatbot.service.interface';

let _chatbotServiceInstance: IChatbotService;

export function createChatbotService(): IChatbotService {
    if(!_chatbotServiceInstance){
        _chatbotServiceInstance = { runFlow };
    }
    return _chatbotServiceInstance;
}
