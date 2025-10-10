
import { IContactSectionRepository } from '../../domain/repositories/contact-section.repository';
import { IContactSectionService } from '../../domain/services/contact-section.service.interface';
import { UpdateContactSectionDto } from '../dtos/contact-section.dto';
import { ContactSection } from '../../domain/entities/contact-section.entity';

export class ContactSectionService implements IContactSectionService {
  constructor(private readonly repository: IContactSectionRepository) {}

  async getContactSection(): Promise<ContactSection | null> {
    return this.repository.getContactSection();
  }

  async updateContactSection(dto: UpdateContactSectionDto): Promise<ContactSection> {
    return this.repository.updateContactSection(dto);
  }
}
