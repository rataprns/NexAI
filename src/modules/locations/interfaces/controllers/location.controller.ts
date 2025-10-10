
import { NextRequest, NextResponse } from 'next/server';
import { resolve } from '@/services/bootstrap';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { ILocationService } from '../../domain/services/location.service.interface';
import { locationSchema, updateLocationSchema } from '../../application/dtos/location.dto';
import { verifySession } from '@/lib/auth';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';

const getService = () => resolve<ILocationService>(SERVICE_KEYS.LocationService);

async function getHandler(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get('active') === 'true';
        const id = searchParams.get('id');

        if (id) {
            const location = await getService().findLocationById(id);
            if (!location) {
                return NextResponse.json({ message: 'Location not found' }, { status: 404 });
            }
            return NextResponse.json(location);
        }
        
        const { isAuthenticated } = await verifySession();
        
        if (activeOnly || !isAuthenticated) {
            const locations = await getService().findAllActiveLocations();
            return NextResponse.json(locations);
        }

        const { user } = await verifySession([UserRole.ADMIN]);
        if (!user) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const locations = await getService().findAllLocations();
        return NextResponse.json(locations);

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function postHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = locationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }
        
        const newLocation = await getService().createLocation(validation.data);
        return NextResponse.json(newLocation, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function putHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = updateLocationSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten() }, { status: 400 });
        }

        const updatedLocation = await getService().updateLocation(validation.data);
        if (!updatedLocation) {
            return NextResponse.json({ message: 'Location not found' }, { status: 404 });
        }
        return NextResponse.json(updatedLocation);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function deleteHandler(req: NextRequest) {
    try {
        const { isAuthenticated } = await verifySession([UserRole.ADMIN]);
        if (!isAuthenticated) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Location ID is required' }, { status: 400 });
        }

        await getService().deleteLocation(id);
        return NextResponse.json({ message: 'Location deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const locationController = {
    getHandler,
    postHandler,
    putHandler,
    deleteHandler,
};
