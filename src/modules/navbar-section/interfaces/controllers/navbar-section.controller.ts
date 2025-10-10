
import { NextRequest, NextResponse } from 'next/server';
import { updateNavbarSectionSchema } from '@/modules/navbar-section/application/dtos/navbar-section.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { INavbarSectionService } from '@/modules/navbar-section/domain/services/navbar-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getNavbarSectionService = () => resolve<INavbarSectionService>(SERVICE_KEYS.NavbarSectionService);

async function getHandler(req: NextRequest) {
  try {
      const content = await getNavbarSectionService().getNavbarSection();
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
      const validation = updateNavbarSectionSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const content = await getNavbarSectionService().updateNavbarSection(validation.data);
      return NextResponse.json(content);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const navbarSectionController = {
  getHandler,
  updateHandler,
};
