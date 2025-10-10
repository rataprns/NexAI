import { userController } from '@/modules/users/interfaces/controllers/user.controller';

export const GET = userController.getMeHandler;
export const PUT = userController.updateMeHandler;
