import { ISettingRepository } from '../../domain/repositories/setting.repository';
import { ISettingService } from '../../domain/services/setting.service.interface';
import { UpdateSettingDto } from '../dtos/setting.dto';
import { Setting } from '../../domain/entities/setting.entity';

export class SettingService implements ISettingService {
  constructor(private readonly settingRepository: ISettingRepository) {}

  async getSettings(): Promise<Setting | null> {
    return this.settingRepository.getSettings();
  }

  async updateSettings(dto: UpdateSettingDto): Promise<Setting> {
    return this.settingRepository.updateSettings(dto);
  }
}
