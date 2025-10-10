
import { IEmailTemplateRepository } from '../../domain/repositories/email-template.repository';
import { IEmailTemplateService } from '../../domain/services/email-template.service.interface';
import { EmailTemplate, EmailTemplateType } from '../../domain/entities/email-template.entity';
import { UpdateEmailTemplateDto } from '../dtos/email-template.dto';

export class EmailTemplateService implements IEmailTemplateService {
  constructor(private readonly repository: IEmailTemplateRepository) {}

  async getAllTemplates(): Promise<EmailTemplate[]> {
    return this.repository.findAll();
  }

  async getTemplate(type: EmailTemplateType): Promise<EmailTemplate | null> {
    return this.repository.findByType(type);
  }

  async updateTemplate(dto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    return this.repository.update(dto);
  }
}
