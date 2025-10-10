
import { HeroSection } from '../entities/hero-section.entity';
import { UpdateHeroSectionDto } from '../../application/dtos/hero-section.dto';

export interface IHeroSectionRepository {
  getHeroSection(): Promise<HeroSection | null>;
  updateHeroSection(dto: UpdateHeroSectionDto): Promise<HeroSection>;
}
