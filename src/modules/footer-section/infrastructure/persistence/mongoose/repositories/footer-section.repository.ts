
import dbConnect from '@/lib/db';
import { IFooterSectionRepository } from '@/modules/footer-section/domain/repositories/footer-section.repository';
import { FooterSection } from '@/modules/footer-section/domain/entities/footer-section.entity';
import { FooterSectionModel } from '../models/footer-section.model';
import { FooterSectionMapper } from '@/modules/footer-section/application/mappers/footer-section.mapper';
import { UpdateFooterSectionDto } from '@/modules/footer-section/application/dtos/footer-section.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseFooterSectionRepository implements IFooterSectionRepository {

  public async getFooterSection(): Promise<FooterSection | null> {
    await dbConnect();
    let content = await FooterSectionModel.findOne();
    if (!content) {
      content = await FooterSectionModel.create(defaultSettings.landingPage.footer);
    }
    return FooterSectionMapper.toDomain(content);
  }

  public async updateFooterSection(dto: UpdateFooterSectionDto): Promise<FooterSection> {
    await dbConnect();
    const updatedContent = await FooterSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedContent) {
        throw new Error('Failed to update or create footer section content.');
    }
    return FooterSectionMapper.toDomain(updatedContent);
  }
}
