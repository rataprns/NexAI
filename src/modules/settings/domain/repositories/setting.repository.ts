import { Setting } from '../entities/setting.entity';
import { UpdateSettingDto } from '../../application/dtos/setting.dto';

export interface ISettingRepository {
  getSettings(): Promise<Setting | null>;
  updateSettings(dto: UpdateSettingDto): Promise<Setting>;
}
