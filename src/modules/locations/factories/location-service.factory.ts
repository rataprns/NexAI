
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { LocationService } from "../application/services/location.service";
import { ILocationRepository } from "../domain/repositories/location.repository";
import { ILocationService } from '../domain/services/location.service.interface';

let instance: ILocationService;

export function createLocationService(): ILocationService {
    if(!instance){
        const repository = container.resolve<ILocationRepository>(SERVICE_KEYS.LocationRepository);
        instance = new LocationService(repository);
    }
    return instance;
}
