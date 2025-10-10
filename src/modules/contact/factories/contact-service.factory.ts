
import { ContactService } from "../application/services/contact.service";
import { IContactService } from '../domain/services/contact.service.interface';

let _contactServiceInstance: IContactService;

export function createContactService(): IContactService {
    if(!_contactServiceInstance){
        _contactServiceInstance = new ContactService();
    }
    return _contactServiceInstance;
}
