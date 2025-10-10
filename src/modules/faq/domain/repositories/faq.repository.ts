
import { FaqSection } from '../entities/faq.entity';
import { UpdateFaqDto } from '../../application/dtos/faq.dto';

export interface IFaqRepository {
  getFaq(): Promise<FaqSection | null>;
  updateFaq(dto: UpdateFaqDto): Promise<FaqSection>;
}
