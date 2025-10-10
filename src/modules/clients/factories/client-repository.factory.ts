
import { MongooseClientRepository } from "../infrastructure/persistence/mongoose/repositories/client.repository";
import { IClientRepository } from '../domain/repositories/client.repository';

let _clientRepositoryInstance: IClientRepository;

export function createClientRepository(): IClientRepository {
    if(!_clientRepositoryInstance){
        _clientRepositoryInstance = new MongooseClientRepository();
    }
    return _clientRepositoryInstance;
}
