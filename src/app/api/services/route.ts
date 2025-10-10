import { serviceController } from '@/modules/services/interfaces/controllers/service.controller';

export const GET = serviceController.getHandler;
export const POST = serviceController.postHandler;
export const PUT = serviceController.putHandler;
export const DELETE = serviceController.deleteHandler;
