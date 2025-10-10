
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { FeatureService } from "../application/services/feature.service";
import { IFeatureRepository } from "../domain/repositories/feature.repository";
import { IFeatureService } from '../domain/services/feature.service.interface';

let _featureServiceInstance: IFeatureService;

export function createFeatureService(): IFeatureService {
    if(!_featureServiceInstance){
        const repository = container.resolve<IFeatureRepository>(SERVICE_KEYS.FeatureRepository);
        _featureServiceInstance = new FeatureService(repository);
    }
    return _featureServiceInstance;
}
