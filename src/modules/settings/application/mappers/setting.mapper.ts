
import { Setting } from '../../domain/entities/setting.entity';
import { ISetting } from '../../infrastructure/persistence/mongoose/models/setting.model';

export class SettingMapper {
  static toDomain(doc: ISetting & { createdAt: Date, updatedAt: Date }): Setting {
    return new Setting(
      doc._id.toString(),
      doc.appName,
      doc.knowledgeBase,
      doc.chatbotInitialMessage,
      doc.theme,
      doc.contactEmail,
      doc.logoUrl,
      doc.logoIconName,
      doc.isIconLogo,
      doc.timezone,
      doc.plugin,
      doc.model,
      {
        showFeatures: doc.landingPage.showFeatures,
        showTestimonials: doc.landingPage.showTestimonials,
        showFaq: doc.landingPage.showFaq,
        showContact: doc.landingPage.showContact,
        showAppointments: doc.landingPage.showAppointments,
        showServices: doc.landingPage.showServices,
        showLanguageSelector: doc.landingPage.showLanguageSelector,
        sectionOrder: doc.landingPage.sectionOrder,
      },
      {
        whatsapp: {
          webhookVerifyToken: doc.integrations?.whatsapp?.webhookVerifyToken,
          accessToken: doc.integrations?.whatsapp?.accessToken,
          appSecret: doc.integrations?.whatsapp?.appSecret,
          fromNumberId: doc.integrations?.whatsapp?.fromNumberId,
        },
        messenger: {
            webhookVerifyToken: doc.integrations?.messenger?.webhookVerifyToken,
            accessToken: doc.integrations?.messenger?.accessToken,
            appSecret: doc.integrations?.messenger?.appSecret,
        },
        instagram: {
            webhookVerifyToken: doc.integrations?.instagram?.webhookVerifyToken,
            accessToken: doc.integrations?.instagram?.accessToken,
            appSecret: doc.integrations?.instagram?.appSecret,
        }
      },
      doc.createdAt,
      doc.updatedAt
    );
  }
}
