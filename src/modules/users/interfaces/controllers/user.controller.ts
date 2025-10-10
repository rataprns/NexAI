import { NextRequest, NextResponse } from 'next/server';
import { updateUserSchema } from '@/modules/users/application/dtos/user.dto';
import { getSession } from '@/lib/auth';
import { resolve } from '@/services/bootstrap';
import { IUserService } from '@/modules/users/domain/services/user.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { UserMapper } from '../../application/mappers/user.mapper';

const getUserService = () => resolve<IUserService>(SERVICE_KEYS.UserService);

async function getMeHandler(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserService().findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(UserMapper.toDto(user));

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function updateMeHandler(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
    }

    const updatedUser = await getUserService().updateUser(session.userId, validation.data);
    return NextResponse.json(updatedUser);

  } catch (error: any) {
    if (error.message.includes('Authentication')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export const userController = {
  getMeHandler,
  updateMeHandler,
};
