
import { IHeroSectionRepository } from '../../domain/repositories/hero-section.repository';
import { IHeroSectionService } from '../../domain/services/hero-section.service.interface';
import { UpdateHeroSectionDto } from '../dtos/hero-section.dto';
import { HeroSection } from '../../domain/entities/hero-section.entity';

export class HeroSectionService implements IHeroSectionService {
  constructor(private readonly heroRepository: IHeroSectionRepository) {}

  async getHeroSection(): Promise<HeroSection | null> {
    return this.heroRepository.getHeroSection();
  }

  async updateHeroSection(dto: UpdateHeroSectionDto): Promise<HeroSection> {
    return this.heroRepository.updateHeroSection(dto);
  }
}
