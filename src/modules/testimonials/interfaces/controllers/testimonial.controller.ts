import { NextRequest, NextResponse } from 'next/server';
import { updateTestimonialsSchema } from '@/modules/testimonials/application/dtos/testimonial.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { ITestimonialService } from '@/modules/testimonials/domain/services/testimonial.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getTestimonialService = () => resolve<ITestimonialService>(SERVICE_KEYS.TestimonialService);

async function getHandler(req: NextRequest) {
  try {
      const testimonials = await getTestimonialService().getTestimonials();
      return NextResponse.json(testimonials);
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
      const validation = updateTestimonialsSchema.safeParse(body);

      if (!validation.success) {
          return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
      }

      const testimonials = await getTestimonialService().updateTestimonials(validation.data);
      return NextResponse.json(testimonials);
  } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const testimonialsController = {
  getHandler,
  updateHandler,
};
