
import { container } from '@/lib/dependency-container';
import { SERVICE_KEYS } from '@/config/service-keys-const';
import { createUserRepository } from './user-repository.factory';
import { createUserService } from './user-service.factory';
import { IUserService } from '../domain/services/user.service.interface';
import { UserRole } from '../domain/entities/user-role.enum';

async function seedDefaultUser(): Promise<void> {
    try {
        const userService = container.resolve<IUserService>(SERVICE_KEYS.UserService);
        const existingAdmin = await userService.findUserByEmail('admin@example.com');
        
        if (!existingAdmin) {
            console.log('No default admin user found. Seeding one now...');
            await userService.register({
                email: 'admin@example.com',
                password: 'password', // You should change this in a real application
                name: 'Admin User',
                role: UserRole.ADMIN,
            });
            console.log('Default admin user (admin@example.com / password) has been created.');
        }
    } catch(error: any) {
        console.error("Failed to seed default user. This might be because the database is not available or another issue occurred.", error.message);
    }
}


export function bootstrapUserModule(): void {
  container.register(SERVICE_KEYS.UserRepository, createUserRepository);
  container.register(SERVICE_KEYS.UserService, createUserService);

  // Seed the default user after registering dependencies
  seedDefaultUser();
}
