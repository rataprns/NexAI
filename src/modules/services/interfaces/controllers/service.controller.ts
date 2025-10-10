import { NextRequest, NextResponse } from 'next/server';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { IServiceService } from '@/modules/services/domain/services/service.service.interface';
import { serviceSchema, updateServiceSchema } from '@/modules/services/application/dtos/service.dto';
import { verifySession } from '@/lib/auth';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';

const getService = () => resolve<IServiceService>(SERVICE_KEYS.ServiceService);

// GET all services (protected for admin) or only active services (public)
async function getHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get('active') === 'true';
        
        if (activeOnly) {
            const services = await getService().findAllActiveServices();
            return NextResponse.json(services);
        }

        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            // If not admin, return active services instead of forbidden
            const services = await getService().findAllActiveServices();
            return NextResponse.json(services);
        }

        const services = await getService().findAllServices();
        return NextResponse.json(services);

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST a new service
async function postHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = serviceSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }
        
        const newService = await getService().createService(validation.data);
        return NextResponse.json(newService, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT (update) a service
async function putHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = updateServiceSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }

        const updatedService = await getService().updateService(validation.data);
        if (!updatedService) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }
        return NextResponse.json(updatedService);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE a service
async function deleteHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Service ID is required' }, { status: 400 });
        }

        await getService().deleteService(id);
        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const serviceController = {
    getHandler,
    postHandler,
    putHandler,
    deleteHandler,
};
