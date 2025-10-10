
import { MongooseSettingRepository } from "../infrastructure/persistence/mongoose/repositories/setting.repository";
import { ISettingRepository } from '../domain/repositories/setting.repository';

let _settingRepositoryInstance: ISettingRepository;

export function createSettingRepository(): ISettingRepository {
    if(!_settingRepositoryInstance){
        _settingRepositoryInstance = new MongooseSettingRepository();
    }
    return _settingRepositoryInstance;
}
