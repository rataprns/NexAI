
import { locationController } from '@/modules/locations/interfaces/controllers/location.controller';

export const GET = locationController.getHandler;
export const POST = locationController.postHandler;
export const PUT = locationController.putHandler;
export const DELETE = locationController.deleteHandler;
