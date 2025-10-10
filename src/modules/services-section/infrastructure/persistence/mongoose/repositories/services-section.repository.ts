
import dbConnect from '@/lib/db';
import { IServicesSectionRepository } from '@/modules/services-section/domain/repositories/services-section.repository';
import { ServicesSection } from '@/modules/services-section/domain/entities/services-section.entity';
import { ServicesSectionModel } from '../models/services-section.model';
import { ServicesSectionMapper } from '@/modules/services-section/application/mappers/services-section.mapper';
import { UpdateServicesSectionDto } from '@/modules/services-section/application/dtos/services-section.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseServicesSectionRepository implements IServicesSectionRepository {

  private getDefaultContent() {
    return {
      badge: "Our Services",
      title: "What We Offer",
      subtitle: "Explore the range of professional services we offer to help you achieve your goals.",
      containerStyles: "w-full py-20 md:py-28 lg:py-32 bg-muted",
      gridStyles: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
    };
  }

  public async getServicesSection(): Promise<ServicesSection | null> {
    await dbConnect();
    let content = await ServicesSectionModel.findOne();
    if (!content) {
      content = await ServicesSectionModel.create(this.getDefaultContent());
    }
    return ServicesSectionMapper.toDomain(content);
  }

  public async updateServicesSection(dto: UpdateServicesSectionDto): Promise<ServicesSection> {
    await dbConnect();
    const updatedContent = await ServicesSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedContent) {
        throw new Error('Failed to update or create services section content.');
    }
    return ServicesSectionMapper.toDomain(updatedContent);
  }
}
