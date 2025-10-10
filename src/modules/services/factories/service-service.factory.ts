
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ServiceService } from "../application/services/service.service";
import { IServiceRepository } from "../domain/repositories/service.repository";
import { IServiceService } from '../domain/services/service.service.interface';

let instance: IServiceService;

export function createServiceService(): IServiceService {
    if(!instance){
        const repository = container.resolve<IServiceRepository>(SERVICE_KEYS.ServiceRepository);
        instance = new ServiceService(repository);
    }
    return instance;
}
