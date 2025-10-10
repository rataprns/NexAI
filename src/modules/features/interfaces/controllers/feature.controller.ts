import { NextRequest, NextResponse } from 'next/server';
import { updateFeaturesSchema } from '@/modules/features/application/dtos/feature.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IFeatureService } from '@/modules/features/domain/services/feature.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getFeatureService = () => resolve<IFeatureService>(SERVICE_KEYS.FeatureService);

async function getHandler(req: NextRequest) {
  try {
      const features = await getFeatureService().getFeatures();
      return NextResponse.json(features);
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
      const validation = updateFeaturesSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const features = await getFeatureService().updateFeatures(validation.data);
      return NextResponse.json(features);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const featuresController = {
  getHandler,
  updateHandler,
};
