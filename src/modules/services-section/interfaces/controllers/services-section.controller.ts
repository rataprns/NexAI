
import { NextRequest, NextResponse } from 'next/server';
import { updateServicesSectionSchema } from '@/modules/services-section/application/dtos/services-section.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IServicesSectionService } from '@/modules/services-section/domain/services/services-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getServicesSectionService = () => resolve<IServicesSectionService>(SERVICE_KEYS.ServicesSectionService);

async function getHandler(req: NextRequest) {
  try {
      const content = await getServicesSectionService().getServicesSection();
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
      const validation = updateServicesSectionSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const content = await getServicesSectionService().updateServicesSection(validation.data);
      return NextResponse.json(content);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const servicesSectionController = {
  getHandler,
  updateHandler,
};
