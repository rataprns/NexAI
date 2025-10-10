
import { ContactFormDto } from '../../application/dtos/contact.dto';

export interface IContactService {
  sendContactMessage(dto: ContactFormDto): Promise<void>;
}
