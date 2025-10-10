
import { schedulingController } from '@/modules/scheduling/interfaces/controllers/scheduling.controller';

export const POST = schedulingController.createHandler;
export const GET = schedulingController.listHandler;
export const DELETE = schedulingController.cancelHandler;
export const PUT = schedulingController.rebookHandler;
