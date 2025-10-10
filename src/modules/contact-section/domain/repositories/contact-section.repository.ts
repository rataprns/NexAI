
import { ContactSection } from '../entities/contact-section.entity';
import { UpdateContactSectionDto } from '../../application/dtos/contact-section.dto';

export interface IContactSectionRepository {
  getContactSection(): Promise<ContactSection | null>;
  updateContactSection(dto: UpdateContactSectionDto): Promise<ContactSection>;
}
