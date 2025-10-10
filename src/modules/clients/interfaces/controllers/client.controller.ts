import { NextRequest, NextResponse } from 'next/server';
import { resolve } from '@/services/bootstrap';
import { IClientService } from '@/modules/clients/domain/services/client.service.interface';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { verifySession } from '@/lib/auth';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';

const getClientService = () => resolve<IClientService>(SERVICE_KEYS.ClientService);

async function listHandler(req: NextRequest) {
  try {
    const { isAuthenticated, user } = await verifySession([UserRole.ADMIN]);
    if (!isAuthenticated) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const clients = await getClientService().findAllClients();
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const clientController = {
  listHandler,
};
