
import { MongooseFooterSectionRepository } from "../infrastructure/persistence/mongoose/repositories/footer-section.repository";
import { IFooterSectionRepository } from '../domain/repositories/footer-section.repository';

let _repositoryInstance: IFooterSectionRepository;

export function createFooterSectionRepository(): IFooterSectionRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseFooterSectionRepository();
    }
    return _repositoryInstance;
}
