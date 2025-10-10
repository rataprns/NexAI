
import { MessengerService } from "../application/services/messenger.service";
import { IMessengerService } from '../domain/services/messenger.service.interface';

let instance: IMessengerService;

export function createMessengerService(): IMessengerService {
    if(!instance){
        instance = new MessengerService();
    }
    return instance;
}
