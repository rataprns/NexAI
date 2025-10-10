
export enum EmailTemplateType {
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  APPOINTMENT_CANCELLATION = 'APPOINTMENT_CANCELLATION',
}

export class EmailTemplate {
  id: string;
  type: EmailTemplateType;
  subject: string;
  body: string; // HTML content
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    type: EmailTemplateType,
    subject: string,
    body: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.type = type;
    this.subject = subject;
    this.body = body;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
