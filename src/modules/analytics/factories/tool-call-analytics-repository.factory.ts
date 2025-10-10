
import { MongooseToolCallAnalyticsRepository } from "../infrastructure/persistence/mongoose/repositories/tool-call-analytics.repository";
import { IToolCallAnalyticsRepository } from '../domain/repositories/tool-call-analytics.repository';

let _repositoryInstance: IToolCallAnalyticsRepository;

export function createToolCallAnalyticsRepository(): IToolCallAnalyticsRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseToolCallAnalyticsRepository();
    }
    return _repositoryInstance;
}
