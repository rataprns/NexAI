
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { EmailTemplateService } from "../application/services/email-template.service";
import { IEmailTemplateRepository } from "../domain/repositories/email-template.repository";
import { IEmailTemplateService } from '../domain/services/email-template.service.interface';

let _serviceInstance: IEmailTemplateService;

export function createEmailTemplateService(): IEmailTemplateService {
  if (!_serviceInstance) {
    const repository = container.resolve<IEmailTemplateRepository>(SERVICE_KEYS.EmailTemplateRepository);
    _serviceInstance = new EmailTemplateService(repository);
  }
  return _serviceInstance;
}
