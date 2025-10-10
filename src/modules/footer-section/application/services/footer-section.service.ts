
import { IFooterSectionRepository } from '../../domain/repositories/footer-section.repository';
import { IFooterSectionService } from '../../domain/services/footer-section.service.interface';
import { UpdateFooterSectionDto } from '../dtos/footer-section.dto';
import { FooterSection } from '../../domain/entities/footer-section.entity';

export class FooterSectionService implements IFooterSectionService {
  constructor(private readonly repository: IFooterSectionRepository) {}

  async getFooterSection(): Promise<FooterSection | null> {
    return this.repository.getFooterSection();
  }

  async updateFooterSection(dto: UpdateFooterSectionDto): Promise<FooterSection> {
    return this.repository.updateFooterSection(dto);
  }
}
