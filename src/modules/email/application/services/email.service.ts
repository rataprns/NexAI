
import nodemailer from 'nodemailer';
import { IEmailService } from '../../domain/services/email.service.interface';
import { EmailOptions } from '../../domain/entities/email-options.entity';
import { config } from '@/lib/config';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (
      !config.email.host ||
      !config.email.port ||
      !config.email.user ||
      !config.email.pass
    ) {
      console.warn("Email service is not configured. Emails will be logged to the console instead of being sent.");
      this.transporter = {
        sendMail: (options: any) => {
            console.log("---- FAKE EMAIL SENT ----");
            console.log("To:", options.to);
            console.log("From:", options.from);
            console.log("Subject:", options.subject);
            console.log("HTML:", options.html);
            console.log("-------------------------");
            return Promise.resolve();
        }
      } as any;
    } else {
        this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.secure,
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
    }
  }

  async sendMail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: config.email.from || options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', options.to);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send email.');
    }
  }
}
