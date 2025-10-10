
import { EmailTemplate, EmailTemplateType } from '../entities/email-template.entity';
import { UpdateEmailTemplateDto } from '../../application/dtos/email-template.dto';

export interface IEmailTemplateRepository {
  findAll(): Promise<EmailTemplate[]>;
  findByType(type: EmailTemplateType): Promise<EmailTemplate | null>;
  update(dto: UpdateEmailTemplateDto): Promise<EmailTemplate>;
}
