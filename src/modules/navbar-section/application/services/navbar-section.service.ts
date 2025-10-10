
import { INavbarSectionRepository } from '../../domain/repositories/navbar-section.repository';
import { INavbarSectionService } from '../../domain/services/navbar-section.service.interface';
import { UpdateNavbarSectionDto } from '../dtos/navbar-section.dto';
import { NavbarSection } from '../../domain/entities/navbar-section.entity';

export class NavbarSectionService implements INavbarSectionService {
  constructor(private readonly repository: INavbarSectionRepository) {}

  async getNavbarSection(): Promise<NavbarSection | null> {
    return this.repository.getNavbarSection();
  }

  async updateNavbarSection(dto: UpdateNavbarSectionDto): Promise<NavbarSection> {
    return this.repository.updateNavbarSection(dto);
  }
}
