
import { MongooseServiceRepository } from "../infrastructure/persistence/mongoose/repositories/service.repository";
import { IServiceRepository } from '../domain/repositories/service.repository';

let instance: IServiceRepository;

export function createServiceRepository(): IServiceRepository {
    if(!instance){
        instance = new MongooseServiceRepository();
    }
    return instance;
}
