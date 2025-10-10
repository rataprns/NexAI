
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { TestimonialService } from "../application/services/testimonial.service";
import { ITestimonialRepository } from "../domain/repositories/testimonial.repository";
import { ITestimonialService } from '../domain/services/testimonial.service.interface';

let _testimonialServiceInstance: ITestimonialService;

export function createTestimonialService(): ITestimonialService {
    if(!_testimonialServiceInstance){
        const repository = container.resolve<ITestimonialRepository>(SERVICE_KEYS.TestimonialRepository);
        _testimonialServiceInstance = new TestimonialService(repository);
    }
    return _testimonialServiceInstance;
}
