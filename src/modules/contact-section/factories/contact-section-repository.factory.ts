
import { MongooseContactSectionRepository } from "../infrastructure/persistence/mongoose/repositories/contact-section.repository";
import { IContactSectionRepository } from '../domain/repositories/contact-section.repository';

let _repositoryInstance: IContactSectionRepository;

export function createContactSectionRepository(): IContactSectionRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseContactSectionRepository();
    }
    return _repositoryInstance;
}
