
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { NavbarSectionService } from "../application/services/navbar-section.service";
import { INavbarSectionRepository } from "../domain/repositories/navbar-section.repository";
import { INavbarSectionService } from '../domain/services/navbar-section.service.interface';

let _serviceInstance: INavbarSectionService;

export function createNavbarSectionService(): INavbarSectionService {
    if(!_serviceInstance){
        const repository = container.resolve<INavbarSectionRepository>(SERVICE_KEYS.NavbarSectionRepository);
        _serviceInstance = new NavbarSectionService(repository);
    }
    return _serviceInstance;
}
