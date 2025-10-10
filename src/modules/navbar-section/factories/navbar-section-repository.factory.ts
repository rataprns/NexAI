
import { MongooseNavbarSectionRepository } from "../infrastructure/persistence/mongoose/repositories/navbar-section.repository";
import { INavbarSectionRepository } from '../domain/repositories/navbar-section.repository';

let _repositoryInstance: INavbarSectionRepository;

export function createNavbarSectionRepository(): INavbarSectionRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseNavbarSectionRepository();
    }
    return _repositoryInstance;
}
