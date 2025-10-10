
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { SecretWordService } from "../application/services/secret-word.service";
import { ISecretWordRepository } from "../domain/repositories/secret-word.repository";
import { ISecretWordService } from '../domain/services/secret-word.service.interface';

let _serviceInstance: ISecretWordService;

export function createSecretWordService(): ISecretWordService {
    if(!_serviceInstance){
        const repository = container.resolve<ISecretWordRepository>(SERVICE_KEYS.SecretWordRepository);
        _serviceInstance = new SecretWordService(repository);
    }
    return _serviceInstance;
}
