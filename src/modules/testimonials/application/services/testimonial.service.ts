
import { ITestimonialRepository } from '../../domain/repositories/testimonial.repository';
import { ITestimonialService } from '../../domain/services/testimonial.service.interface';
import { UpdateTestimonialsDto } from '../dtos/testimonial.dto';
import { TestimonialsSection } from '../../domain/entities/testimonial.entity';

export class TestimonialService implements ITestimonialService {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async getTestimonials(): Promise<TestimonialsSection | null> {
    return this.testimonialRepository.getTestimonials();
  }

  async updateTestimonials(dto: UpdateTestimonialsDto): Promise<TestimonialsSection> {
    return this.testimonialRepository.updateTestimonials(dto);
  }
}
