import { NextRequest, NextResponse } from 'next/server';
import { loginSchema, registerSchema } from '@/modules/users/application/dtos/user.dto';
import { createSession, clearSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IUserService } from '@/modules/users/domain/services/user.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';

const getUserService = () => resolve<IUserService>(SERVICE_KEYS.UserService);

async function registerHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
    }
    const user = await getUserService().register(validation.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

async function loginHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
    }
    const { user } = await getUserService().login(validation.data);
    
    await createSession(user.id, user.email, user.role);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

async function logoutHandler(req: NextRequest) {
    await clearSession();
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}

export const authController = {
  registerHandler,
  loginHandler,
  logoutHandler,
};
