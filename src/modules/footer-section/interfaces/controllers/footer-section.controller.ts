
import { NextRequest, NextResponse } from 'next/server';
import { updateFooterSectionSchema } from '@/modules/footer-section/application/dtos/footer-section.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IFooterSectionService } from '@/modules/footer-section/domain/services/footer-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getFooterSectionService = () => resolve<IFooterSectionService>(SERVICE_KEYS.FooterSectionService);

async function getHandler(req: NextRequest) {
  try {
      const content = await getFooterSectionService().getFooterSection();
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
      const validation = updateFooterSectionSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const content = await getFooterSectionService().updateFooterSection(validation.data);
      return NextResponse.json(content);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const footerSectionController = {
  getHandler,
  updateHandler,
};
