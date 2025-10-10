
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { FooterSectionService } from "../application/services/footer-section.service";
import { IFooterSectionRepository } from "../domain/repositories/footer-section.repository";
import { IFooterSectionService } from '../domain/services/footer-section.service.interface';

let _serviceInstance: IFooterSectionService;

export function createFooterSectionService(): IFooterSectionService {
    if(!_serviceInstance){
        const repository = container.resolve<IFooterSectionRepository>(SERVICE_KEYS.FooterSectionRepository);
        _serviceInstance = new FooterSectionService(repository);
    }
    return _serviceInstance;
}
