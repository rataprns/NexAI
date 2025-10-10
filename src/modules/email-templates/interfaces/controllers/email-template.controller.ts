
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { IEmailTemplateService } from '../../domain/services/email-template.service.interface';
import { updateEmailTemplateSchema } from '../../application/dtos/email-template.dto';

const getEmailTemplateService = () => resolve<IEmailTemplateService>(SERVICE_KEYS.EmailTemplateService);

async function getHandler(req: NextRequest) {
  try {
    const { isAuthenticated } = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const templates = await getEmailTemplateService().getAllTemplates();
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function updateHandler(req: NextRequest) {
  try {
    const { isAuthenticated } = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateEmailTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
    }

    const template = await getEmailTemplateService().updateTemplate(validation.data);
    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const emailTemplateController = {
  getHandler,
  updateHandler,
};
