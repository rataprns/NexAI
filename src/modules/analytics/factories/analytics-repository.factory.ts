
import { MongooseAnalyticsRepository } from "../infrastructure/persistence/mongoose/repositories/analytics.repository";
import { IAnalyticsRepository } from '../domain/repositories/analytics.repository';

let _repositoryInstance: IAnalyticsRepository;

export function createAnalyticsRepository(): IAnalyticsRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseAnalyticsRepository();
    }
    return _repositoryInstance;
}
