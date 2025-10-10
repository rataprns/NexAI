
import dbConnect from '@/lib/db';
import { ITestimonialRepository } from '@/modules/testimonials/domain/repositories/testimonial.repository';
import { TestimonialsSection } from '@/modules/testimonials/domain/entities/testimonial.entity';
import { TestimonialsSectionModel } from '../models/testimonial.model';
import { TestimonialMapper } from '@/modules/testimonials/application/mappers/testimonial.mapper';
import { UpdateTestimonialsDto } from '@/modules/testimonials/application/dtos/testimonial.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseTestimonialRepository implements ITestimonialRepository {

  public async getTestimonials(): Promise<TestimonialsSection | null> {
    await dbConnect();
    let testimonials = await TestimonialsSectionModel.findOne();
    if (!testimonials) {
      testimonials = await TestimonialsSectionModel.create(defaultSettings.landingPage.testimonials);
    }
    return TestimonialMapper.toDomain(testimonials);
  }

  public async updateTestimonials(dto: UpdateTestimonialsDto): Promise<TestimonialsSection> {
    await dbConnect();
    const updatedTestimonials = await TestimonialsSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedTestimonials) {
        throw new Error('Failed to update or create testimonials section settings.');
    }
    return TestimonialMapper.toDomain(updatedTestimonials);
  }
}
