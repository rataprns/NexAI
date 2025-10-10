import { NextRequest, NextResponse } from 'next/server';
import { updateHeroSectionSchema } from '@/modules/hero/application/dtos/hero-section.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IHeroSectionService } from '@/modules/hero/domain/services/hero-section.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getHeroSectionService = () => resolve<IHeroSectionService>(SERVICE_KEYS.HeroSectionService);

async function getHandler(req: NextRequest) {
  try {
      const hero = await getHeroSectionService().getHeroSection();
      return NextResponse.json(hero);
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
      const validation = updateHeroSectionSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const hero = await getHeroSectionService().updateHeroSection(validation.data);
      return NextResponse.json(hero);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const heroController = {
  getHandler,
  updateHandler,
};
