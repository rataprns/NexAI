
import dbConnect from '@/lib/db';
import { ISettingRepository } from '@/modules/settings/domain/repositories/setting.repository';
import { Setting } from '@/modules/settings/domain/entities/setting.entity';
import { SettingModel } from '../models/setting.model';
import { SettingMapper } from '@/modules/settings/application/mappers/setting.mapper';
import { UpdateSettingDto } from '@/modules/settings/application/dtos/setting.dto';
import defaultSettings from '@/lib/default-settings.json';

export class MongooseSettingRepository implements ISettingRepository {

  private async getFallbackSettings(): Promise<Setting> {
    const now = new Date();
    return new Setting(
      'default-settings-id',
      defaultSettings.appName,
      defaultSettings.knowledgeBase,
      defaultSettings.chatbotInitialMessage,
      defaultSettings.theme,
      defaultSettings.contactEmail,
      defaultSettings.logoUrl,
      defaultSettings.logoIconName,
      defaultSettings.isIconLogo,
      defaultSettings.timezone,
      defaultSettings.plugin,
      defaultSettings.model,
      {
        showFeatures: defaultSettings.landingPage.showFeatures,
        showTestimonials: defaultSettings.landingPage.showTestimonials,
        showFaq: defaultSettings.landingPage.showFaq,
        showContact: defaultSettings.landingPage.showContact,
        showAppointments: defaultSettings.landingPage.showAppointments,
        showServices: defaultSettings.landingPage.showServices,
        showLanguageSelector: defaultSettings.landingPage.showLanguageSelector,
        sectionOrder: defaultSettings.landingPage.sectionOrder,
      },
      {
          whatsapp: defaultSettings.integrations.whatsapp,
          messenger: defaultSettings.integrations.messenger,
          instagram: defaultSettings.integrations.instagram,
      },
      now,
      now
    );
  }

  public async getSettings(): Promise<Setting | null> {
    try {
      await dbConnect();
      let settings = await SettingModel.findOne();
      if (!settings) {
        // When seeding for the first time, use the entire defaultSettings object.
        const seedData = {
          ...defaultSettings,
          landingPage: {
            ...defaultSettings.landingPage
          },
          heroSection: {
            ...defaultSettings.landingPage.heroSection
          }
        };
        settings = await SettingModel.create(seedData);
      }
      return SettingMapper.toDomain(settings);
    } catch (error) {
      console.warn("Database connection failed. Using fallback settings.");
      return this.getFallbackSettings();
    }
  }

  public async updateSettings(dto: UpdateSettingDto): Promise<Setting> {
    await dbConnect();
    const updatedSettings = await SettingModel.findOneAndUpdate(
      {},
      { $set: dto },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    if (!updatedSettings) {
        throw new Error('Failed to update or create settings.');
    }
    return SettingMapper.toDomain(updatedSettings);
  }
}
