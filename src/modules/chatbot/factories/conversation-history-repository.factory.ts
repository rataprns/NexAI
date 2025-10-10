
import { MongooseConversationHistoryRepository } from "../infrastructure/persistence/mongoose/repositories/conversation-history.repository";
import { IConversationHistoryRepository } from '../domain/repositories/conversation-history.repository';

let _repositoryInstance: IConversationHistoryRepository;

export function createConversationHistoryRepository(): IConversationHistoryRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseConversationHistoryRepository();
    }
    return _repositoryInstance;
}
