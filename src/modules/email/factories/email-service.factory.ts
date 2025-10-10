
import { EmailService } from "../application/services/email.service";
import { IEmailService } from '../domain/services/email.service.interface';

let _emailServiceInstance: IEmailService;

export function createEmailService(): IEmailService {
    if(!_emailServiceInstance){
        _emailServiceInstance = new EmailService();
    }
    return _emailServiceInstance;
}
