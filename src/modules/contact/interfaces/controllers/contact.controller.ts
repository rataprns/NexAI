import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/modules/contact/application/dtos/contact.dto';
import { resolve } from '@/services/bootstrap';
import { IContactService } from '@/modules/contact/domain/services/contact.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getContactService = () => resolve<IContactService>(SERVICE_KEYS.ContactService);

async function submitHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
    }

    await getContactService().sendContactMessage(validation.data);

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("[CONTACT_API_ERROR]", error);
    return NextResponse.json({ message: error.message || 'An internal error occurred.' }, { status: 500 });
  }
}

export const contactController = {
  submitHandler,
};
