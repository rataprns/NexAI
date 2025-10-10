
import { WhatsappService } from "../application/services/whatsapp.service";
import { IWhatsappService } from '../domain/services/whatsapp.service.interface';

let instance: IWhatsappService;

export function createWhatsappService(): IWhatsappService {
    if(!instance){
        instance = new WhatsappService();
    }
    return instance;
}
