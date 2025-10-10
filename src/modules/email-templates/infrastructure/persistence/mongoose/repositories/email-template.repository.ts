
import dbConnect from '@/lib/db';
import { IEmailTemplateRepository } from '@/modules/email-templates/domain/repositories/email-template.repository';
import { EmailTemplate, EmailTemplateType } from '@/modules/email-templates/domain/entities/email-template.entity';
import { EmailTemplateModel } from '../models/email-template.model';
import { EmailTemplateMapper } from '@/modules/email-templates/application/mappers/email-template.mapper';
import { UpdateEmailTemplateDto } from '@/modules/email-templates/application/dtos/email-template.dto';

const defaultTemplates = {
  [EmailTemplateType.APPOINTMENT_CONFIRMATION]: {
    subject: 'Appointment Confirmation with {appName}',
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello {name},</h2>
        <p>Your appointment has been successfully scheduled.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> {date}</li>
          <li><strong>Time:</strong> {time}</li>
        </ul>
        <p>Add this event to your calendar:</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding-right: 10px;">
              <a href="{googleCalendarLink}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Google Calendar
              </a>
            </td>
            <td align="center">
              <a href="{icsLink}" style="background-color: #f0f0f0; color: #333; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Apple/Outlook Calendar
              </a>
            </td>
          </tr>
        </table>
        <p>Thank you for booking with us!</p>
        <p><strong>{appName} Team</strong></p>
      </div>
    `,
  },
  [EmailTemplateType.APPOINTMENT_CANCELLATION]: {
    subject: 'Appointment Cancellation with {appName}',
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello {name},</h2>
        <p>Your appointment on {date} at {time} has been cancelled.</p>
        <p>If this was a mistake, please contact us to reschedule.</p>
        <p><strong>{appName} Team</strong></p>
      </div>
    `,
  },
};

export class MongooseEmailTemplateRepository implements IEmailTemplateRepository {

  private async seedTemplates() {
    for (const type in EmailTemplateType) {
      const existing = await EmailTemplateModel.findOne({ type });
      if (!existing) {
        await EmailTemplateModel.create({
          type,
          ...defaultTemplates[type as EmailTemplateType],
        });
      }
    }
  }

  public async findAll(): Promise<EmailTemplate[]> {
    await dbConnect();
    await this.seedTemplates();
    const templates = await EmailTemplateModel.find({}).sort({ type: 1 });
    return templates.map(EmailTemplateMapper.toDomain);
  }

  public async findByType(type: EmailTemplateType): Promise<EmailTemplate | null> {
    await dbConnect();
    await this.seedTemplates();
    const template = await EmailTemplateModel.findOne({ type });
    return template ? EmailTemplateMapper.toDomain(template) : null;
  }

  public async update(dto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    await dbConnect();
    const updatedTemplate = await EmailTemplateModel.findOneAndUpdate(
      { type: dto.type },
      { $set: { subject: dto.subject, body: dto.body } },
      { new: true, upsert: true, runValidators: true }
    );
    if (!updatedTemplate) {
      throw new Error('Failed to update or create email template.');
    }
    return EmailTemplateMapper.toDomain(updatedTemplate);
  }
}
