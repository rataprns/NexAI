
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { SettingService } from "../application/services/setting.service";
import { ISettingRepository } from "../domain/repositories/setting.repository";
import { ISettingService } from '../domain/services/setting.service.interface';

let _settingServiceInstance: ISettingService;

export function createSettingService(): ISettingService {
    if(!_settingServiceInstance){
        const repository = container.resolve<ISettingRepository>(SERVICE_KEYS.SettingRepository);
        _settingServiceInstance = new SettingService(repository);
    }
    return _settingServiceInstance;
}
