import { NextRequest, NextResponse } from 'next/server';
import { updateFaqSchema } from '@/modules/faq/application/dtos/faq.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IFaqService } from '@/modules/faq/domain/services/faq.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getFaqService = () => resolve<IFaqService>(SERVICE_KEYS.FaqService);

async function getHandler(req: NextRequest) {
  try {
      const faq = await getFaqService().getFaq();
      return NextResponse.json(faq);
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
      const validation = updateFaqSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const faq = await getFaqService().updateFaq(validation.data);
      return NextResponse.json(faq);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const faqController = {
  getHandler,
  updateHandler,
};
