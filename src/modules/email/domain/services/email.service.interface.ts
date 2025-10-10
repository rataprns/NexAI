
import { EmailOptions } from '../entities/email-options.entity';

export interface IEmailService {
  sendMail(options: EmailOptions): Promise<void>;
}
