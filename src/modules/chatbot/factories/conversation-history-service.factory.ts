
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ConversationHistoryService } from "../application/services/conversation-history.service";
import { IConversationHistoryRepository } from "../domain/repositories/conversation-history.repository";
import { IConversationHistoryService } from '../domain/services/conversation-history.service.interface';

let _serviceInstance: IConversationHistoryService;

export function createConversationHistoryService(): IConversationHistoryService {
    if(!_serviceInstance){
        const repository = container.resolve<IConversationHistoryRepository>(SERVICE_KEYS.ConversationHistoryRepository);
        _serviceInstance = new ConversationHistoryService(repository);
    }
    return _serviceInstance;
}
