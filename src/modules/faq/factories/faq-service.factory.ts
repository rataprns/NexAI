
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { FaqService } from "../application/services/faq.service";
import { IFaqRepository } from "../domain/repositories/faq.repository";
import { IFaqService } from '../domain/services/faq.service.interface';

let _faqServiceInstance: IFaqService;

export function createFaqService(): IFaqService {
    if(!_faqServiceInstance){
        const repository = container.resolve<IFaqRepository>(SERVICE_KEYS.FaqRepository);
        _faqServiceInstance = new FaqService(repository);
    }
    return _faqServiceInstance;
}
