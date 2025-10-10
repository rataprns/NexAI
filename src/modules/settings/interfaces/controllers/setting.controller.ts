
import { NextRequest, NextResponse } from 'next/server';
import { updateSettingSchema } from '@/modules/settings/application/dtos/setting.dto';
import { getSession, verifySession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { ISettingService } from '@/modules/settings/domain/services/setting.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getSettingService = () => resolve<ISettingService>(SERVICE_KEYS.SettingService);

async function getHandler(req: NextRequest) {
  try {
      const { isAuthenticated } = await verifySession();
      if (!isAuthenticated) {
          return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      }

      const settings = await getSettingService().getSettings();
      return NextResponse.json(settings);
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
      const validation = updateSettingSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const settings = await getSettingService().updateSettings(validation.data);
      return NextResponse.json(settings);
  } catch (error: any) {
      if (error.message.includes('Authentication')) {
          return NextResponse.json({ message: error.message }, { status: 401 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const settingController = {
  getHandler,
  updateHandler,
};
