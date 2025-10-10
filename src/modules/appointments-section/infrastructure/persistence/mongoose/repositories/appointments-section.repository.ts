
import dbConnect from '@/lib/db';
import { IAppointmentsSectionRepository } from '@/modules/appointments-section/domain/repositories/appointments-section.repository';
import { AppointmentsSection } from '@/modules/appointments-section/domain/entities/appointments-section.entity';
import { AppointmentsSectionModel } from '../models/appointments-section.model';
import { AppointmentsSectionMapper } from '@/modules/appointments-section/application/mappers/appointments-section.mapper';
import { UpdateAppointmentsSectionDto } from '@/modules/appointments-section/application/dtos/appointments-section.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseAppointmentsSectionRepository implements IAppointmentsSectionRepository {

  public async getAppointmentsSection(): Promise<AppointmentsSection | null> {
    await dbConnect();
    let content = await AppointmentsSectionModel.findOne();
    if (!content) {
      content = await AppointmentsSectionModel.create(defaultSettings.landingPage.appointments);
    }
    return AppointmentsSectionMapper.toDomain(content);
  }

  public async updateAppointmentsSection(dto: UpdateAppointmentsSectionDto): Promise<AppointmentsSection> {
    await dbConnect();
    const updatedContent = await AppointmentsSectionModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
     if (!updatedContent) {
        throw new Error('Failed to update or create appointments section content.');
    }
    return AppointmentsSectionMapper.toDomain(updatedContent);
  }
}
