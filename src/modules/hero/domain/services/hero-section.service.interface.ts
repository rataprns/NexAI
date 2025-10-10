
import { HeroSection } from '../entities/hero-section.entity';
import { UpdateHeroSectionDto } from '../../application/dtos/hero-section.dto';

export interface IHeroSectionService {
  getHeroSection(): Promise<HeroSection | null>;
  updateHeroSection(dto: UpdateHeroSectionDto): Promise<HeroSection>;
}
