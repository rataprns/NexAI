
import { IFaqRepository } from '../../domain/repositories/faq.repository';
import { IFaqService } from '../../domain/services/faq.service.interface';
import { UpdateFaqDto } from '../dtos/faq.dto';
import { FaqSection } from '../../domain/entities/faq.entity';

export class FaqService implements IFaqService {
  constructor(private readonly faqRepository: IFaqRepository) {}

  async getFaq(): Promise<FaqSection | null> {
    return this.faqRepository.getFaq();
  }

  async updateFaq(dto: UpdateFaqDto): Promise<FaqSection> {
    return this.faqRepository.updateFaq(dto);
  }
}
