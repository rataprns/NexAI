
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ServicesSectionService } from "../application/services/services-section.service";
import { IServicesSectionRepository } from "../domain/repositories/services-section.repository";
import { IServicesSectionService } from '../domain/services/services-section.service.interface';

let _serviceInstance: IServicesSectionService;

export function createServicesSectionService(): IServicesSectionService {
    if(!_serviceInstance){
        const repository = container.resolve<IServicesSectionRepository>(SERVICE_KEYS.ServicesSectionRepository);
        _serviceInstance = new ServicesSectionService(repository);
    }
    return _serviceInstance;
}
