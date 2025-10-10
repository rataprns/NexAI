
import { MongooseUserRepository } from "../infrastructure/persistence/mongoose/repositories/user.repository";
import { IUserRepository } from '../domain/repositories/user.repository';

let _userRepositoryInstance: IUserRepository;

export function createUserRepository(): IUserRepository {
    if(!_userRepositoryInstance){
        _userRepositoryInstance = new MongooseUserRepository();
    }
    return _userRepositoryInstance;
}
