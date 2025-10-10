
import { IContactService } from '../../domain/services/contact.service.interface';
import { ContactFormDto } from '../dtos/contact.dto';
import { resolve } from '@/services/bootstrap';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

export class ContactService implements IContactService {
  private getSettingService(): ISettingService {
    return resolve<ISettingService>(SERVICE_KEYS.SettingService);
  }

  async sendContactMessage(dto: ContactFormDto): Promise<void> {
    const settingService = this.getSettingService();
    const settings = await settingService.getSettings();
    const toEmail = settings?.contactEmail;

    if (!toEmail) {
      console.error("Contact email is not configured in settings.");
      throw new Error("Unable to send message, contact email not configured.");
    }

    // This is where you would integrate with an email sending service
    // like SendGrid, Resend, or AWS SES.
    console.log("---- Sending Contact Email ----");
    console.log(`To: ${toEmail}`);
    console.log(`From: ${dto.email} (${dto.name})`);
    console.log(`Message: ${dto.message}`);
    console.log("-------------------------------");
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
