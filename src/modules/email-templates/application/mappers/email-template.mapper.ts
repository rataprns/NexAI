
import { EmailTemplate } from '../../domain/entities/email-template.entity';
import { IEmailTemplate } from '../../infrastructure/persistence/mongoose/models/email-template.model';

export class EmailTemplateMapper {
  static toDomain(doc: IEmailTemplate): EmailTemplate {
    return new EmailTemplate(
      doc._id.toString(),
      doc.type,
      doc.subject,
      doc.body,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
