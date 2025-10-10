
import { TestimonialsSection } from '../entities/testimonial.entity';
import { UpdateTestimonialsDto } from '../../application/dtos/testimonial.dto';

export interface ITestimonialRepository {
  getTestimonials(): Promise<TestimonialsSection | null>;
  updateTestimonials(dto: UpdateTestimonialsDto): Promise<TestimonialsSection>;
}
