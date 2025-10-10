
import dbConnect from '@/lib/db';
import { IFaqRepository } from '@/modules/faq/domain/repositories/faq.repository';
import { FaqSection } from '@/modules/faq/domain/entities/faq.entity';
import { FaqSectionModel } from '../models/faq.model';
import { FaqMapper } from '@/modules/faq/application/mappers/faq.mapper';
import { UpdateFaqDto } from '@/modules/faq/application/dtos/faq.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseFaqRepository implements IFaqRepository {

  public async getFaq(): Promise<FaqSection | null> {
    await dbConnect();
    let faq = await FaqSectionModel.findOne();
    if (!faq) {
      faq = await FaqSectionModel.create(defaultSettings.landingPage.faq);
    }
    return FaqMapper.toDomain(faq);
  }

  public async updateFaq(dto: UpdateFaqDto): Promise<FaqSection> {
    await dbConnect();
    const updatedFaq = await FaqSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedFaq) {
        throw new Error('Failed to update or create faq section settings.');
    }
    return FaqMapper.toDomain(updatedFaq);
  }
}
