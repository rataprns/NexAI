
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ClientService } from "../application/services/client.service";
import { IClientRepository } from "../domain/repositories/client.repository";
import { IClientService } from '../domain/services/client.service.interface';

let _clientServiceInstance: IClientService;

export function createClientService(): IClientService {
    if(!_clientServiceInstance){
        const repository = container.resolve<IClientRepository>(SERVICE_KEYS.ClientRepository);
        _clientServiceInstance = new ClientService(repository);
    }
    return _clientServiceInstance;
}
