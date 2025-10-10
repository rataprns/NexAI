
import { NavbarSection } from '../entities/navbar-section.entity';
import { UpdateNavbarSectionDto } from '../../application/dtos/navbar-section.dto';

export interface INavbarSectionRepository {
  getNavbarSection(): Promise<NavbarSection | null>;
  updateNavbarSection(dto: UpdateNavbarSectionDto): Promise<NavbarSection>;
}
