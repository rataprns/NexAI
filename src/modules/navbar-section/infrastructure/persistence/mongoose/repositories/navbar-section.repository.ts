
import dbConnect from '@/lib/db';
import { INavbarSectionRepository } from '@/modules/navbar-section/domain/repositories/navbar-section.repository';
import { NavbarSection } from '@/modules/navbar-section/domain/entities/navbar-section.entity';
import { NavbarSectionModel } from '../models/navbar-section.model';
import { NavbarSectionMapper } from '@/modules/navbar-section/application/mappers/navbar-section.mapper';
import { UpdateNavbarSectionDto } from '@/modules/navbar-section/application/dtos/navbar-section.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseNavbarSectionRepository implements INavbarSectionRepository {

  public async getNavbarSection(): Promise<NavbarSection | null> {
    await dbConnect();
    let content = await NavbarSectionModel.findOne();
    if (!content) {
      content = await NavbarSectionModel.create(defaultSettings.landingPage.navbar);
    }
    return NavbarSectionMapper.toDomain(content);
  }

  public async updateNavbarSection(dto: UpdateNavbarSectionDto): Promise<NavbarSection> {
    await dbConnect();
    const updatedContent = await NavbarSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedContent) {
        throw new Error('Failed to update or create navbar section content.');
    }
    return NavbarSectionMapper.toDomain(updatedContent);
  }
}
