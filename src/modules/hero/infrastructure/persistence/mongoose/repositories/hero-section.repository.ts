
import dbConnect from '@/lib/db';
import { IHeroSectionRepository } from '@/modules/hero/domain/repositories/hero-section.repository';
import { HeroSection } from '@/modules/hero/domain/entities/hero-section.entity';
import { HeroSectionModel } from '../models/hero-section.model';
import { HeroSectionMapper } from '@/modules/hero/application/mappers/hero-section.mapper';
import { UpdateHeroSectionDto } from '@/modules/hero/application/dtos/hero-section.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseHeroSectionRepository implements IHeroSectionRepository {

  public async getHeroSection(): Promise<HeroSection | null> {
    await dbConnect();
    let hero = await HeroSectionModel.findOne();
    if (!hero) {
      hero = await HeroSectionModel.create(defaultSettings.landingPage.heroSection);
    }
    return HeroSectionMapper.toDomain(hero);
  }

  public async updateHeroSection(dto: UpdateHeroSectionDto): Promise<HeroSection> {
    await dbConnect();
    const updatedHero = await HeroSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedHero) {
        throw new Error('Failed to update or create hero section settings.');
    }
    return HeroSectionMapper.toDomain(updatedHero);
  }
}
