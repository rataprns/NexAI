
import { MongooseHeroSectionRepository } from "../infrastructure/persistence/mongoose/repositories/hero-section.repository";
import { IHeroSectionRepository } from '../domain/repositories/hero-section.repository';

let _heroRepositoryInstance: IHeroSectionRepository;

export function createHeroSectionRepository(): IHeroSectionRepository {
    if(!_heroRepositoryInstance){
        _heroRepositoryInstance = new MongooseHeroSectionRepository();
    }
    return _heroRepositoryInstance;
}
