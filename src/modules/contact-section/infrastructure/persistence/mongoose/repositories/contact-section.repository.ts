
import dbConnect from '@/lib/db';
import { IContactSectionRepository } from '@/modules/contact-section/domain/repositories/contact-section.repository';
import { ContactSection } from '@/modules/contact-section/domain/entities/contact-section.entity';
import { ContactSectionModel } from '../models/contact-section.model';
import { ContactSectionMapper } from '@/modules/contact-section/application/mappers/contact-section.mapper';
import { UpdateContactSectionDto } from '@/modules/contact-section/application/dtos/contact-section.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseContactSectionRepository implements IContactSectionRepository {

  public async getContactSection(): Promise<ContactSection | null> {
    await dbConnect();
    let content = await ContactSectionModel.findOne();
    if (!content) {
      content = await ContactSectionModel.create(defaultSettings.landingPage.contactSection);
    }
    return ContactSectionMapper.toDomain(content);
  }

  public async updateContactSection(dto: UpdateContactSectionDto): Promise<ContactSection> {
    await dbConnect();
    const updatedContent = await ContactSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedContent) {
        throw new Error('Failed to update or create contact section content.');
    }
    return ContactSectionMapper.toDomain(updatedContent);
  }
}
