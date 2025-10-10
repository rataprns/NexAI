
import { container } from "@/lib/dependency-container";
import { SERVICE_KEYS } from "@/config/service-keys-const";
import { UserService } from "../application/services/user.service";
import { IUserRepository } from "../domain/repositories/user.repository";
import { IUserService } from '../domain/services/user.service.interface';

let _userServiceInstance: IUserService;

export function createUserService(): IUserService {
    if(!_userServiceInstance){
        const repository = container.resolve<IUserRepository>(SERVICE_KEYS.UserRepository);
        _userServiceInstance = new UserService(repository);
    }
    return _userServiceInstance;
}
