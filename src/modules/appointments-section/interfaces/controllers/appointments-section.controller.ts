
import { NextRequest, NextResponse } from 'next/server';
import { updateAppointmentsSectionSchema } from '@/modules/appointments-section/application/dtos/appointments-section.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IAppointmentsSectionService } from '@/modules/appointments-section/domain/services/appointments-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getAppointmentsSectionService = () => resolve<IAppointmentsSectionService>(SERVICE_KEYS.AppointmentsSectionService);

async function getHandler(req: NextRequest) {
  try {
      const content = await getAppointmentsSectionService().getAppointmentsSection();
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
      const validation = updateAppointmentsSectionSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const content = await getAppointmentsSectionService().updateAppointmentsSection(validation.data);
      return NextResponse.json(content);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const appointmentsSectionController = {
  getHandler,
  updateHandler,
};
