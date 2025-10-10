
import { MongooseTestimonialRepository } from "../infrastructure/persistence/mongoose/repositories/testimonial.repository";
import { ITestimonialRepository } from '../domain/repositories/testimonial.repository';

let _testimonialRepositoryInstance: ITestimonialRepository;

export function createTestimonialRepository(): ITestimonialRepository {
    if(!_testimonialRepositoryInstance){
        _testimonialRepositoryInstance = new MongooseTestimonialRepository();
    }
    return _testimonialRepositoryInstance;
}
