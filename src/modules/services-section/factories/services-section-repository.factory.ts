
import { MongooseServicesSectionRepository } from "../infrastructure/persistence/mongoose/repositories/services-section.repository";
import { IServicesSectionRepository } from '../domain/repositories/services-section.repository';

let _repositoryInstance: IServicesSectionRepository;

export function createServicesSectionRepository(): IServicesSectionRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseServicesSectionRepository();
    }
    return _repositoryInstance;
}
