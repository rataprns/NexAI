
import { NextRequest, NextResponse } from 'next/server';
import { updateContactSectionSchema } from '@/modules/contact-section/application/dtos/contact-section.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IContactSectionService } from '@/modules/contact-section/domain/services/contact-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getContactSectionService = () => resolve<IContactSectionService>(SERVICE_KEYS.ContactSectionService);

async function getHandler(req: NextRequest) {
  try {
      const content = await getContactSectionService().getContactSection();
      return NextResponse.json(content);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function updateHandler(req: NextRequest) {
  try {
      const session = await getSession();
      if (!session?.userId) {
          return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      }

      const body = await req.json();
      const validation = updateContactSectionSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const content = await getContactSectionService().updateContactSection(validation.data);
      return NextResponse.json(content);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const contactSectionController = {
  getHandler,
  updateHandler,
};
