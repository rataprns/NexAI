
import { MongooseLocationRepository } from "../infrastructure/persistence/mongoose/repositories/location.repository";
import { ILocationRepository } from '../domain/repositories/location.repository';

let instance: ILocationRepository;

export function createLocationRepository(): ILocationRepository {
    if(!instance){
        instance = new MongooseLocationRepository();
    }
    return instance;
}
