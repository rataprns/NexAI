
import { MongooseFaqRepository } from "../infrastructure/persistence/mongoose/repositories/faq.repository";
import { IFaqRepository } from '../domain/repositories/faq.repository';

let _faqRepositoryInstance: IFaqRepository;

export function createFaqRepository(): IFaqRepository {
    if(!_faqRepositoryInstance){
        _faqRepositoryInstance = new MongooseFaqRepository();
    }
    return _faqRepositoryInstance;
}
