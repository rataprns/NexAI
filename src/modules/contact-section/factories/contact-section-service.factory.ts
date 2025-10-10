
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { ContactSectionService } from "../application/services/contact-section.service";
import { IContactSectionRepository } from "../domain/repositories/contact-section.repository";
import { IContactSectionService } from '../domain/services/contact-section.service.interface';

let _serviceInstance: IContactSectionService;

export function createContactSectionService(): IContactSectionService {
    if(!_serviceInstance){
        const repository = container.resolve<IContactSectionRepository>(SERVICE_KEYS.ContactSectionRepository);
        _serviceInstance = new ContactSectionService(repository);
    }
    return _serviceInstance;
}
