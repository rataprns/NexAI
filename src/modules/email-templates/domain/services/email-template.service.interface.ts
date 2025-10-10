
import { EmailTemplate, EmailTemplateType } from '../entities/email-template.entity';
import { UpdateEmailTemplateDto } from '../../application/dtos/email-template.dto';

export interface IEmailTemplateService {
  getAllTemplates(): Promise<EmailTemplate[]>;
  getTemplate(type: EmailTemplateType): Promise<EmailTemplate | null>;
  updateTemplate(dto: UpdateEmailTemplateDto): Promise<EmailTemplate>;
}
