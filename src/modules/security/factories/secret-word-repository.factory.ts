
import { MongooseSecretWordRepository } from "../infrastructure/persistence/mongoose/repositories/secret-word.repository";
import { ISecretWordRepository } from '../domain/repositories/secret-word.repository';

let _repositoryInstance: ISecretWordRepository;

export function createSecretWordRepository(): ISecretWordRepository {
    if(!_repositoryInstance){
        _repositoryInstance = new MongooseSecretWordRepository();
    }
    return _repositoryInstance;
}
