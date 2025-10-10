
import { MongooseFeatureRepository } from "../infrastructure/persistence/mongoose/repositories/feature.repository";
import { IFeatureRepository } from '../domain/repositories/feature.repository';

let _featureRepositoryInstance: IFeatureRepository;

export function createFeatureRepository(): IFeatureRepository {
    if(!_featureRepositoryInstance){
        _featureRepositoryInstance = new MongooseFeatureRepository();
    }
    return _featureRepositoryInstance;
}
