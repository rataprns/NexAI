
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { HeroSectionService } from "../application/services/hero-section.service";
import { IHeroSectionRepository } from "../domain/repositories/hero-section.repository";
import { IHeroSectionService } from '../domain/services/hero-section.service.interface';

let _heroServiceInstance: IHeroSectionService;

export function createHeroSectionService(): IHeroSectionService {
    if(!_heroServiceInstance){
        const repository = container.resolve<IHeroSectionRepository>(SERVICE_KEYS.HeroSectionRepository);
        _heroServiceInstance = new HeroSectionService(repository);
    }
    return _heroServiceInstance;
}
