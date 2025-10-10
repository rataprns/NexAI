
import { FooterSection } from '../entities/footer-section.entity';
import { UpdateFooterSectionDto } from '../../application/dtos/footer-section.dto';

export interface IFooterSectionService {
  getFooterSection(): Promise<FooterSection | null>;
  updateFooterSection(dto: UpdateFooterSectionDto): Promise<FooterSection>;
}
