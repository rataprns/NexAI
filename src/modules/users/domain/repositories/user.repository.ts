import { User } from '../entities/user.entity';
import { RegisterDto } from '../../application/dtos/user.dto';

export interface IUserRepository {
  create(userDto: RegisterDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<User>;
}
